from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_instructor
from app.models import Feedback, InstructorProfile, User
from app.schemas import FeedbackCreateRequest, FeedbackResponse

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("/{slug}", response_model=FeedbackResponse, status_code=201)
def submit_feedback(slug: str, payload: FeedbackCreateRequest, db: Session = Depends(get_db)):
    profile = db.query(InstructorProfile).filter(InstructorProfile.slug == slug).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Instructor not found")

    entry = Feedback(instructor_id=profile.id, **payload.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/me", response_model=list[FeedbackResponse])
def list_my_feedback(user: User = Depends(get_current_instructor), db: Session = Depends(get_db)):
    if not user.profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    entries = (
        db.query(Feedback)
        .filter(Feedback.instructor_id == user.profile.id, Feedback.is_removed.is_(False))
        .order_by(Feedback.created_at.desc())
        .all()
    )
    return entries
