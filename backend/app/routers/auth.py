import re
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import get_current_user
from app.models import AccountStatus, InstructorProfile, User, UserRole
from app.schemas import LoginRequest, MeResponse, RegisterRequest, TokenResponse
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


def slugify(name: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "instructor"
    return base


def unique_slug(db: Session, full_name: str) -> str:
    base = slugify(full_name)
    candidate = base
    suffix = 1
    while db.query(InstructorProfile).filter(InstructorProfile.slug == candidate).first():
        suffix += 1
        candidate = f"{base}-{suffix}"
    return candidate


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    user = User(
        id=str(uuid.uuid4()),
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=UserRole.instructor,
        status=AccountStatus.pending,
    )
    db.add(user)
    db.flush()

    profile = InstructorProfile(
        user_id=user.id,
        slug=unique_slug(db, payload.full_name),
        modality=payload.modality,
        contact_email=payload.email,
    )
    db.add(profile)
    db.commit()

    token = create_access_token(user.id)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if user.status == AccountStatus.suspended:
        raise HTTPException(status_code=403, detail="This account has been suspended")
    token = create_access_token(user.id)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=MeResponse)
def me(user: User = Depends(get_current_user)):
    slug = user.profile.slug if user.profile else None
    return MeResponse(
        id=user.id, email=user.email, full_name=user.full_name,
        role=user.role, status=user.status, slug=slug,
    )
