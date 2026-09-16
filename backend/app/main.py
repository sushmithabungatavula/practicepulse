from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import AccountStatus, User, UserRole
from app.routers import admin, analytics, auth, feedback, instructors, public
from app.security import hash_password

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PracticePulse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(instructors.router)
app.include_router(feedback.router)
app.include_router(analytics.router)
app.include_router(admin.router)
app.include_router(public.router)


@app.on_event("startup")
def seed_admin() -> None:
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.admin_email).first()
        if not existing:
            admin_user = User(
                email=settings.admin_email,
                hashed_password=hash_password(settings.admin_password),
                full_name="PracticePulse Admin",
                role=UserRole.admin,
                status=AccountStatus.approved,
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()


@app.get("/api/health")
def health():
    return {"status": "ok"}
