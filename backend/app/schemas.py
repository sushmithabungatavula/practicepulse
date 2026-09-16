from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, conint

from app.models import AccountStatus, UserRole


# ---------- Auth ----------

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=8)
    modality: str = "Yoga"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MeResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: UserRole
    status: AccountStatus
    slug: Optional[str] = None

    class Config:
        from_attributes = True


# ---------- Instructor profile ----------

class ProfileUpdateRequest(BaseModel):
    bio: Optional[str] = None
    modality: Optional[str] = None
    certifications: Optional[list[str]] = None
    specialties: Optional[list[str]] = None
    class_offerings: Optional[list[str]] = None
    gallery: Optional[list[str]] = None
    neighborhood: Optional[str] = None
    website: Optional[str] = None
    instagram: Optional[str] = None
    contact_email: Optional[str] = None
    phone: Optional[str] = None
    profile_photo_url: Optional[str] = None


class ProfileResponse(BaseModel):
    id: str
    slug: str
    full_name: str
    modality: str
    bio: str
    certifications: list[str]
    specialties: list[str]
    class_offerings: list[str]
    gallery: list[str]
    neighborhood: str
    website: str
    instagram: str
    contact_email: str
    phone: str
    profile_photo_url: str

    class Config:
        from_attributes = True


# ---------- Feedback ----------

Rating = conint(ge=1, le=5)
Recommend = conint(ge=0, le=10)


class FeedbackCreateRequest(BaseModel):
    overall_rating: Rating
    communication_rating: Rating
    pacing_rating: Rating
    welcomed_rating: Rating
    community_rating: Rating
    knowledge_rating: Rating
    recommend_score: Recommend

    favorite_aspect: str = ""
    suggestions: str = ""

    is_returning_student: bool = False

    experience_level: str = ""
    neighborhood: str = ""
    primary_goal: str = ""

    consent_to_publish: bool = False
    display_name: str = ""


class FeedbackResponse(BaseModel):
    id: str
    created_at: datetime
    overall_rating: int
    communication_rating: int
    pacing_rating: int
    welcomed_rating: int
    community_rating: int
    knowledge_rating: int
    recommend_score: int
    favorite_aspect: str
    suggestions: str
    is_returning_student: bool
    experience_level: str
    neighborhood: str
    primary_goal: str
    consent_to_publish: bool
    display_name: str
    is_flagged: bool

    class Config:
        from_attributes = True


class TestimonialResponse(BaseModel):
    id: str
    created_at: datetime
    overall_rating: int
    favorite_aspect: str
    display_name: str

    class Config:
        from_attributes = True


# ---------- Public ----------

class PublicProfileResponse(BaseModel):
    slug: str
    full_name: str
    modality: str
    bio: str
    certifications: list[str]
    specialties: list[str]
    class_offerings: list[str]
    gallery: list[str]
    neighborhood: str
    website: str
    instagram: str
    contact_email: str
    profile_photo_url: str
    average_rating: float
    review_count: int
    testimonials: list[TestimonialResponse]


class DirectoryEntry(BaseModel):
    slug: str
    full_name: str
    modality: str
    neighborhood: str
    specialties: list[str]
    average_rating: float
    review_count: int
    profile_photo_url: str


# ---------- Analytics ----------

class MonthlyTrendPoint(BaseModel):
    month: str
    average_rating: float
    review_count: int


class ThemeCount(BaseModel):
    word: str
    count: int


class AnalyticsResponse(BaseModel):
    average_rating: float
    satisfaction_rate: float  # % of reviews rated 4-5
    recommendation_rate: float  # % promoters (score 9-10), NPS-style
    nps: float
    returning_student_rate: float
    review_count: int
    review_growth_pct: Optional[float]
    engagement_score: float
    rating_breakdown: dict[str, float]
    monthly_trends: list[MonthlyTrendPoint]
    positive_themes: list[ThemeCount]
    improvement_themes: list[ThemeCount]
    class_popularity: list[ThemeCount]


# ---------- AI summary (on-demand, Claude API) ----------

class AISentimentBreakdown(BaseModel):
    positive_pct: int = Field(ge=0, le=100)
    neutral_pct: int = Field(ge=0, le=100)
    negative_pct: int = Field(ge=0, le=100)


class AITheme(BaseModel):
    label: str
    quote: str


class AISummaryResult(BaseModel):
    summary: str
    sentiment: AISentimentBreakdown
    positive_themes: list[AITheme]
    improvement_themes: list[AITheme]


class AISummaryResponse(BaseModel):
    result: AISummaryResult
    reviews_analyzed: int
    generated_at: datetime


# ---------- Admin ----------

class AdminInstructorRow(BaseModel):
    id: str
    email: str
    full_name: str
    status: AccountStatus
    created_at: datetime
    slug: Optional[str] = None
    review_count: int = 0
    average_rating: float = 0.0

    class Config:
        from_attributes = True


class AdminPlatformMetrics(BaseModel):
    total_instructors: int
    pending_instructors: int
    approved_instructors: int
    total_reviews: int
    platform_average_rating: float
    reviews_last_30_days: int
