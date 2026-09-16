"""Seed a demo instructor with sample feedback so dashboards have data to show.

Run with:  python -m app.seed_demo
"""
import random
from datetime import datetime, timedelta

from app.database import Base, SessionLocal, engine
from app.models import AccountStatus, Feedback, InstructorProfile, User, UserRole
from app.routers.auth import unique_slug
from app.security import hash_password

Base.metadata.create_all(bind=engine)

FAVORITE_ASPECTS = [
    "loved the breathing exercises and calm atmosphere",
    "great music and welcoming community vibe",
    "clear instructions and helpful adjustments",
    "the meditation at the end was wonderful",
    "loved the pacing and challenging poses",
    "felt so welcomed as a beginner",
    "amazing energy and motivating instructor",
    "the community here is so supportive",
]
IMPROVEMENTS = [
    "would love a slightly bigger room",
    "more beginner modifications please",
    "could use more variety in music",
    "sometimes pacing feels rushed",
    "more advance notice for schedule changes",
    "",
    "",
]
GOALS = ["Flexibility", "Stress relief", "Strength", "Community", "Mindfulness"]
LEVELS = ["New", "Beginner", "Intermediate", "Advanced"]
NEIGHBORHOODS = ["Lincoln Park", "Wicker Park", "Logan Square", "West Loop", "Hyde Park"]


def run():
    db = SessionLocal()
    try:
        email = "maya@practicepulse.app"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print("Demo instructor already exists, skipping.")
            return

        user = User(
            email=email,
            hashed_password=hash_password("demo12345"),
            full_name="Maya Chen",
            role=UserRole.instructor,
            status=AccountStatus.approved,
        )
        db.add(user)
        db.flush()

        profile = InstructorProfile(
            user_id=user.id,
            slug=unique_slug(db, "Maya Chen"),
            modality="Yoga",
            bio="Maya is a Chicago-based vinyasa and restorative yoga instructor with 8 years of "
                "teaching experience, focused on building strength, breath awareness, and community.",
            certifications=["RYT-500", "Yin Yoga Certified", "Trauma-Informed Yoga"],
            specialties=["Vinyasa Flow", "Restorative", "Breathwork", "Prenatal"],
            class_offerings=["Morning Flow", "Slow & Restorative", "Power Vinyasa", "Sunset Yin"],
            gallery=[],
            neighborhood="Lincoln Park",
            website="https://mayachenyoga.example.com",
            instagram="@mayachenyoga",
            contact_email=email,
            phone="",
            profile_photo_url="",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        random.seed(42)
        now = datetime.utcnow()
        for i in range(48):
            days_ago = random.randint(0, 150)
            created = now - timedelta(days=days_ago, hours=random.randint(0, 23))
            overall = random.choices([5, 4, 3], weights=[0.6, 0.3, 0.1])[0]
            entry = Feedback(
                instructor_id=profile.id,
                created_at=created,
                overall_rating=overall,
                communication_rating=min(5, max(1, overall + random.choice([-1, 0, 0, 1]))),
                pacing_rating=min(5, max(1, overall + random.choice([-1, 0, 0, 1]))),
                welcomed_rating=min(5, max(1, overall + random.choice([-1, 0, 1]))),
                community_rating=min(5, max(1, overall + random.choice([-1, 0, 1]))),
                knowledge_rating=min(5, max(1, overall + random.choice([0, 0, 1]))),
                recommend_score=random.choices(range(6, 11), weights=[5, 5, 10, 30, 50])[0],
                favorite_aspect=random.choice(FAVORITE_ASPECTS),
                suggestions=random.choice(IMPROVEMENTS),
                is_returning_student=random.random() < 0.55,
                experience_level=random.choice(LEVELS),
                neighborhood=random.choice(NEIGHBORHOODS),
                primary_goal=random.choice(GOALS),
                consent_to_publish=random.random() < 0.4,
                display_name=random.choice(["Jamie R.", "Alex T.", "Sam K.", "", "", "Chris P."]),
            )
            db.add(entry)
        db.commit()

        print("Seeded demo instructor:")
        print(f"  email: {email}")
        print("  password: demo12345")
        print(f"  public profile slug: {profile.slug}")
    finally:
        db.close()


if __name__ == "__main__":
    run()
