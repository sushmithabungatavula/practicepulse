from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_instructor
from app.models import InstructorProfile, User
from app.schemas import ProfileResponse, ProfileUpdateRequest

router = APIRouter(prefix="/api/instructors", tags=["instructors"])


def _to_response(profile: InstructorProfile, full_name: str) -> ProfileResponse:
    return ProfileResponse(
        id=profile.id,
        slug=profile.slug,
        full_name=full_name,
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
        phone=profile.phone,
        profile_photo_url=profile.profile_photo_url,
    )


@router.get("/me", response_model=ProfileResponse)
def get_my_profile(user: User = Depends(get_current_instructor)):
    if not user.profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return _to_response(user.profile, user.full_name)


@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    payload: ProfileUpdateRequest,
    user: User = Depends(get_current_instructor),
    db: Session = Depends(get_db),
):
    profile = user.profile
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(profile, field, value)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return _to_response(profile, user.full_name)
