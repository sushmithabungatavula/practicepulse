# PracticePulse

A client feedback & reputation platform for independent yoga, meditation, breathwork, Pilates,
and mindfulness instructors. Students leave anonymous per-class feedback via a QR code;
instructors get a business-intelligence dashboard (satisfaction, NPS, retention, trends, themes)
and a public reputation profile; admins moderate the platform.

## Stack

- **Backend:** FastAPI + SQLAlchemy, JWT auth (self-contained — no external auth provider to configure)
- **Database:** SQLite by default (zero setup). Set `DATABASE_URL` to a Postgres URL to switch.
- **Frontend:** React (Vite) + Tailwind CSS + Chart.js + `qrcode.react`

## Project layout

```
practicepulse/
  backend/    FastAPI app (app/main.py)
  frontend/   React app (src/App.jsx)
```

## Running it

### 1. Backend

```bash
cd practicepulse/backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # edit if you want to change admin credentials or use Postgres
uvicorn app.main:app --reload --port 8000
```

On first startup this creates an admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`
(defaults: `admin@practicepulse.app` / `changeme123`).

> **Port 8000 already in use?** Docker Desktop sometimes binds `localhost:8000` on this kind of
> setup. If API calls silently 404, run `lsof -i :8000` to check what's listening, then either stop
> it or run the backend on another port (`--port 8010`) and update the proxy target in
> `frontend/vite.config.js` to match.

Optional — seed a demo instructor with ~48 realistic feedback entries so the dashboard isn't empty:

```bash
python -m app.seed_demo
# creates sush@practicepulse.app / demo12345, public profile at /instructors/sush
```

### 2. Frontend

```bash
cd practicepulse/frontend
npm install
npm run dev
```

Open the printed local URL. The Vite dev server proxies `/api` to `http://localhost:8000`.

## Core features implemented

- **Instructor portal:** registration, JWT login, editable profile (bio, certifications,
  specialties, class offerings, gallery, social/contact links), auto-generated QR code linking to
  the instructor's anonymous feedback form.
- **Anonymous student feedback form:** no account required, star ratings across 6 categories,
  0–10 recommend score, free-text favorite aspect / suggestions, optional demographics
  (experience level, neighborhood, wellness goal), optional consent to publish as a testimonial.
- **Instructor analytics dashboard:** average rating, satisfaction rate, recommendation rate/NPS,
  returning-student rate, review growth, a composite engagement score, monthly rating trend chart,
  category breakdown chart, and no-AI keyword-frequency extraction of common positive themes and
  requested improvements.
- **Public instructor profile:** searchable directory + individual profile pages with bio,
  certifications, specialties, class offerings, gallery, rating, and published testimonials.
- **Admin portal:** approve/reject/suspend instructor accounts, remove individual reviews (with an
  optional recorded reason), platform-wide KPI metrics, CSV export.

## Design notes / deliberate simplifications

- **Auth:** the brief suggested Firebase Auth or Clerk; this build uses self-contained JWT auth
  (bcrypt + `python-jose`) instead, so the project runs immediately with zero external accounts to
  configure. Swapping in Firebase/Clerk later would mean replacing `app/security.py` +
  `app/deps.py` and the frontend `AuthContext`.
- **Database:** SQLite by default for zero-setup local development; the code is Postgres-ready via
  `DATABASE_URL` (add `psycopg[binary]` to `requirements.txt` when you switch).
- **Theme extraction:** "most common positive themes" / "most requested improvements" use a simple
  stopword-filtered word-frequency count over feedback text — deliberately no AI/LLM calls, per
  the brief's emphasis on BI over AI.
- **Photo/gallery uploads:** implemented as URL fields rather than file upload + storage, to keep
  the project deployable without configuring an object-storage bucket. Swappable later.

## Not implemented (stretch goals, per the brief)

Email notifications, PDF reports, badges, class scheduling links, multi-language support, and
AI-assisted sentiment summaries were intentionally left out as optional stretch goals.

## Demo accounts (after running `seed_demo.py`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@practicepulse.app | changeme123 |
| Instructor (approved, with sample data) | sush@practicepulse.app | demo12345 |
