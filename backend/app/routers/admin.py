import csv
import io
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_admin
from app.models import AccountStatus, Feedback, InstructorProfile, User, UserRole
from app.schemas import AdminInstructorRow, AdminPlatformMetrics, FeedbackResponse

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/instructors", response_model=list[AdminInstructorRow])
def list_instructors(_: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    instructors = db.query(User).filter(User.role == UserRole.instructor).order_by(User.created_at.desc()).all()
    rows = []
    for u in instructors:
        review_count, avg_rating = 0, 0.0
        if u.profile:
            entries = db.query(Feedback).filter(
                Feedback.instructor_id == u.profile.id, Feedback.is_removed.is_(False)
            ).all()
            review_count = len(entries)
            if review_count:
                avg_rating = round(sum(e.overall_rating for e in entries) / review_count, 2)
        rows.append(AdminInstructorRow(
            id=u.id, email=u.email, full_name=u.full_name, status=u.status,
            created_at=u.created_at, slug=u.profile.slug if u.profile else None,
            review_count=review_count, average_rating=avg_rating,
        ))
    return rows


@router.put("/instructors/{user_id}/status", response_model=AdminInstructorRow)
def set_instructor_status(
    user_id: str, new_status: AccountStatus,
    _: User = Depends(get_current_admin), db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.role == UserRole.instructor).first()
    if not user:
        raise HTTPException(status_code=404, detail="Instructor not found")
    user.status = new_status
    db.add(user)
    db.commit()
    db.refresh(user)
    review_count, avg_rating = 0, 0.0
    if user.profile:
        entries = db.query(Feedback).filter(
            Feedback.instructor_id == user.profile.id, Feedback.is_removed.is_(False)
        ).all()
        review_count = len(entries)
        if review_count:
            avg_rating = round(sum(e.overall_rating for e in entries) / review_count, 2)
    return AdminInstructorRow(
        id=user.id, email=user.email, full_name=user.full_name, status=user.status,
        created_at=user.created_at, slug=user.profile.slug if user.profile else None,
        review_count=review_count, average_rating=avg_rating,
    )


@router.get("/reviews", response_model=list[FeedbackResponse])
def list_reviews(
    instructor_id: str | None = None,
    _: User = Depends(get_current_admin), db: Session = Depends(get_db),
):
    query = db.query(Feedback).filter(Feedback.is_removed.is_(False))
    if instructor_id:
        query = query.filter(Feedback.instructor_id == instructor_id)
    return query.order_by(Feedback.created_at.desc()).limit(200).all()


@router.delete("/reviews/{review_id}", status_code=204)
def remove_review(
    review_id: str, reason: str = "",
    _: User = Depends(get_current_admin), db: Session = Depends(get_db),
):
    review = db.query(Feedback).filter(Feedback.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_removed = True
    review.removal_reason = reason
    db.add(review)
    db.commit()


@router.get("/metrics", response_model=AdminPlatformMetrics)
def platform_metrics(_: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    instructors = db.query(User).filter(User.role == UserRole.instructor).all()
    total_instructors = len(instructors)
    pending = sum(1 for u in instructors if u.status == AccountStatus.pending)
    approved = sum(1 for u in instructors if u.status == AccountStatus.approved)

    reviews = db.query(Feedback).filter(Feedback.is_removed.is_(False)).all()
    total_reviews = len(reviews)
    platform_avg = round(sum(r.overall_rating for r in reviews) / total_reviews, 2) if total_reviews else 0.0
    cutoff = datetime.utcnow() - timedelta(days=30)
    recent = sum(1 for r in reviews if r.created_at >= cutoff)

    return AdminPlatformMetrics(
        total_instructors=total_instructors,
        pending_instructors=pending,
        approved_instructors=approved,
        total_reviews=total_reviews,
        platform_average_rating=platform_avg,
        reviews_last_30_days=recent,
    )


@router.get("/export")
def export_metrics(_: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    instructors = db.query(User).filter(User.role == UserRole.instructor).all()

    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow([
        "full_name", "email", "status", "slug", "review_count",
        "average_rating", "created_at",
    ])
    for u in instructors:
        review_count, avg_rating = 0, 0.0
        if u.profile:
            entries = db.query(Feedback).filter(
                Feedback.instructor_id == u.profile.id, Feedback.is_removed.is_(False)
            ).all()
            review_count = len(entries)
            if review_count:
                avg_rating = round(sum(e.overall_rating for e in entries) / review_count, 2)
        writer.writerow([
            u.full_name, u.email, u.status.value,
            u.profile.slug if u.profile else "", review_count, avg_rating, u.created_at,
        ])

    buffer.seek(0)
    return StreamingResponse(
        iter([buffer.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=practicepulse_export.csv"},
    )
