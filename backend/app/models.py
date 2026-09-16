import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


def gen_uuid() -> str:
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    instructor = "instructor"
    admin = "admin"


class AccountStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    suspended = "suspended"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.instructor, nullable=False)
    status = Column(Enum(AccountStatus), default=AccountStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("InstructorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class InstructorProfile(Base):
    __tablename__ = "instructor_profiles"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)

    modality = Column(String, default="Yoga")  # Yoga, Meditation, Breathwork, Pilates, Mindfulness
    bio = Column(Text, default="")
    certifications = Column(JSON, default=list)  # list[str]
    specialties = Column(JSON, default=list)  # list[str]
    class_offerings = Column(JSON, default=list)  # list[str]
    gallery = Column(JSON, default=list)  # list[str] image urls

    neighborhood = Column(String, default="")
    website = Column(String, default="")
    instagram = Column(String, default="")
    contact_email = Column(String, default="")
    phone = Column(String, default="")
    profile_photo_url = Column(String, default="")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
    feedback_entries = relationship("Feedback", back_populates="instructor", cascade="all, delete-orphan")


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=gen_uuid)
    instructor_id = Column(String, ForeignKey("instructor_profiles.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Core ratings, 1-5
    overall_rating = Column(Integer, nullable=False)
    communication_rating = Column(Integer, nullable=False)
    pacing_rating = Column(Integer, nullable=False)
    welcomed_rating = Column(Integer, nullable=False)
    community_rating = Column(Integer, nullable=False)
    knowledge_rating = Column(Integer, nullable=False)

    # Net Promoter style, 0-10
    recommend_score = Column(Integer, nullable=False)

    favorite_aspect = Column(Text, default="")
    suggestions = Column(Text, default="")

    is_returning_student = Column(Boolean, default=False)

    # Optional demographics
    experience_level = Column(String, default="")  # New, Beginner, Intermediate, Advanced
    neighborhood = Column(String, default="")
    primary_goal = Column(String, default="")  # Flexibility, Stress relief, Strength, Community, etc.

    # Testimonial display consent
    consent_to_publish = Column(Boolean, default=False)
    display_name = Column(String, default="")  # optional, student-chosen, e.g. "Jamie R."

    # Moderation
    is_removed = Column(Boolean, default=False)
    is_flagged = Column(Boolean, default=False)
    removal_reason = Column(String, default="")

    instructor = relationship("InstructorProfile", back_populates="feedback_entries")
