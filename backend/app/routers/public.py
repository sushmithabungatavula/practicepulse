from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AccountStatus, Feedback, InstructorProfile
from app.schemas import DirectoryEntry, PublicProfileResponse, TestimonialResponse

router = APIRouter(prefix="/api/public", tags=["public"])


def _stats(db: Session, instructor_id: str) -> tuple[float, int]:
    entries = (
        db.query(Feedback)
        .filter(Feedback.instructor_id == instructor_id, Feedback.is_removed.is_(False))
        .all()
    )
    count = len(entries)
    if count == 0:
        return 0.0, 0
    avg = round(sum(e.overall_rating for e in entries) / count, 2)
    return avg, count


@router.get("/instructors", response_model=list[DirectoryEntry])
def directory(
    q: str = Query("", description="Search by name or specialty"),
    neighborhood: str = Query(""),
    modality: str = Query(""),
    db: Session = Depends(get_db),
):
    query = (
        db.query(InstructorProfile)
        .join(InstructorProfile.user)
        .filter(InstructorProfile.user.has(status=AccountStatus.approved))
    )
    profiles = query.all()

    results = []
    for p in profiles:
        if neighborhood and neighborhood.lower() not in (p.neighborhood or "").lower():
            continue
        if modality and modality.lower() != (p.modality or "").lower():
            continue
        haystack = f"{p.user.full_name} {' '.join(p.specialties or [])}".lower()
        if q and q.lower() not in haystack:
            continue
        avg, count = _stats(db, p.id)
        results.append(DirectoryEntry(
            slug=p.slug, full_name=p.user.full_name, modality=p.modality,
            neighborhood=p.neighborhood, specialties=p.specialties or [],
            average_rating=avg, review_count=count, profile_photo_url=p.profile_photo_url,
        ))
    results.sort(key=lambda r: r.average_rating, reverse=True)
    return results


@router.get("/instructors/{slug}", response_model=PublicProfileResponse)
def public_profile(slug: str, db: Session = Depends(get_db)):
    profile = db.query(InstructorProfile).filter(InstructorProfile.slug == slug).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Instructor not found")

    avg, count = _stats(db, profile.id)

    testimonials = (
        db.query(Feedback)
        .filter(
            Feedback.instructor_id == profile.id,
            Feedback.is_removed.is_(False),
            Feedback.consent_to_publish.is_(True),
        )
        .order_by(Feedback.created_at.desc())
        .limit(20)
        .all()
    )

    return PublicProfileResponse(
        slug=profile.slug,
        full_name=profile.user.full_name,
        modality=profile.modality,
        bio=profile.bio,
        certifications=profile.certifications or [],
        specialties=profile.specialties or [],
        class_offerings=profile.class_offerings or [],
        gallery=profile.gallery or [],
        neighborhood=profile.neighborhood,
        website=profile.website,
        instagram=profile.instagram,
        contact_email=profile.contact_email,
        profile_photo_url=profile.profile_photo_url,
        average_rating=avg,
        review_count=count,
        testimonials=[TestimonialResponse.model_validate(t) for t in testimonials],
    )
