"""Vercel Python serverless entrypoint.

Vercel's Python runtime auto-detects an ASGI `app` in this module. The actual
application code lives in ../backend/app so that local development (uvicorn)
and this deployment entrypoint share a single implementation.
"""
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "backend"))

from app.main import app  # noqa: E402
