from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.ai_summary import AISummaryError, NotEnoughFeedback, generate_summary
from app.database import get_db
from app.deps import get_current_instructor
from app.models import Feedback, User
from app.schemas import AISummaryResponse, AnalyticsResponse
from app.utils.analytics import (
    build_monthly_trends,
    compute_engagement_score,
    extract_themes,
    previous_period_growth,
)

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/me", response_model=AnalyticsResponse)
def my_analytics(user: User = Depends(get_current_instructor), db: Session = Depends(get_db)):
    if not user.profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    entries = (
        db.query(Feedback)
        .filter(Feedback.instructor_id == user.profile.id, Feedback.is_removed.is_(False))
        .order_by(Feedback.created_at.asc())
        .all()
    )

    count = len(entries)
    if count == 0:
        return AnalyticsResponse(
            average_rating=0, satisfaction_rate=0, recommendation_rate=0, nps=0,
            returning_student_rate=0, review_count=0, review_growth_pct=None,
            engagement_score=0, rating_breakdown={
                "communication": 0, "pacing": 0, "welcomed": 0, "community": 0, "knowledge": 0,
            },
            monthly_trends=[], positive_themes=[], improvement_themes=[], class_popularity=[],
        )

    avg = lambda vals: round(sum(vals) / len(vals), 2)

    average_rating = avg([e.overall_rating for e in entries])
    satisfaction_rate = round(sum(1 for e in entries if e.overall_rating >= 4) / count * 100, 1)

    promoters = sum(1 for e in entries if e.recommend_score >= 9)
    detractors = sum(1 for e in entries if e.recommend_score <= 6)
    nps = round(((promoters - detractors) / count) * 100, 1)
    recommendation_rate = round(promoters / count * 100, 1)

    returning_rate = round(sum(1 for e in entries if e.is_returning_student) / count * 100, 1)

    engagement_score = compute_engagement_score(average_rating, recommendation_rate, returning_rate)

    rating_breakdown = {
        "communication": avg([e.communication_rating for e in entries]),
        "pacing": avg([e.pacing_rating for e in entries]),
        "welcomed": avg([e.welcomed_rating for e in entries]),
        "community": avg([e.community_rating for e in entries]),
        "knowledge": avg([e.knowledge_rating for e in entries]),
    }

    monthly_trends = build_monthly_trends(entries)
    positive_themes = extract_themes([e.favorite_aspect for e in entries])
    improvement_themes = extract_themes([e.suggestions for e in entries])
    class_popularity = extract_themes([e.primary_goal for e in entries if e.primary_goal])
    growth = previous_period_growth(entries)

    return AnalyticsResponse(
        average_rating=average_rating,
        satisfaction_rate=satisfaction_rate,
        recommendation_rate=recommendation_rate,
        nps=nps,
        returning_student_rate=returning_rate,
        review_count=count,
        review_growth_pct=growth,
        engagement_score=engagement_score,
        rating_breakdown=rating_breakdown,
        monthly_trends=[dict(m) for m in monthly_trends],
        positive_themes=[dict(t) for t in positive_themes],
        improvement_themes=[dict(t) for t in improvement_themes],
        class_popularity=[dict(t) for t in class_popularity],
    )


@router.post("/me/ai-summary", response_model=AISummaryResponse)
def generate_ai_summary(user: User = Depends(get_current_instructor), db: Session = Depends(get_db)):
    """On-demand only - never called automatically. Costs real money per click."""
    if not user.profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    entries = (
        db.query(Feedback)
        .filter(Feedback.instructor_id == user.profile.id, Feedback.is_removed.is_(False))
        .order_by(Feedback.created_at.desc())
        .all()
    )

    try:
        result, reviews_analyzed = generate_summary(entries)
    except NotEnoughFeedback as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except AISummaryError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return AISummaryResponse(
        result=result,
        reviews_analyzed=reviews_analyzed,
        generated_at=datetime.utcnow(),
    )
