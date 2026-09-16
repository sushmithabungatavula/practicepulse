"""On-demand AI summary of anonymous feedback via the Claude API.

Deliberately separate from app/utils/analytics.py, which does the
deterministic (no-AI) keyword-frequency theme extraction that powers the
main dashboard. This module is an explicit, instructor-triggered upgrade
layer, not a replacement for it.
"""
import anthropic

from app.config import settings
from app.models import Feedback
from app.schemas import AISummaryResult

MAX_ENTRIES = 50
MIN_ENTRIES = 3

SYSTEM_PROMPT = (
    "You analyze anonymous student feedback for an independent yoga/wellness "
    "instructor. You will be given a numbered list of feedback entries, each "
    "with an overall star rating (1-5), a 'favorite aspect' comment, and a "
    "'suggestion' comment (either may be blank). Produce: an overall "
    "sentiment breakdown across the entries as percentages that sum to "
    "100; two to four positive themes and zero to four improvement themes, "
    "each with a short label and one supporting quote copied verbatim from "
    "the feedback (never invent or paraphrase a quote); and a 2-3 sentence "
    "plain-language summary an instructor could read in ten seconds. Do not "
    "invent facts, numbers, or feedback that isn't in the input."
)


class AISummaryError(Exception):
    """Raised for any Claude API failure; the router maps this to a 502."""


class NotEnoughFeedback(Exception):
    """Raised when there isn't enough text feedback yet to summarize."""


def build_transcript(entries: list[Feedback]) -> str:
    lines = []
    for i, e in enumerate(entries, start=1):
        lines.append(
            f"{i}. rating={e.overall_rating}/5 | "
            f"favorite_aspect={e.favorite_aspect or '(blank)'} | "
            f"suggestion={e.suggestions or '(blank)'}"
        )
    return "\n".join(lines)


def generate_summary(entries: list[Feedback]) -> tuple[AISummaryResult, int]:
    """Returns (result, reviews_analyzed) - the count reflects entries with
    actual written text, capped at MAX_ENTRIES, not the raw entry count."""
    textual = [e for e in entries if e.favorite_aspect or e.suggestions]
    if len(textual) < MIN_ENTRIES:
        raise NotEnoughFeedback(
            f"Need at least {MIN_ENTRIES} reviews with written comments to summarize "
            f"(have {len(textual)})."
        )

    if not settings.anthropic_api_key:
        raise AISummaryError("AI summary is not configured on this deployment.")

    sample = textual[:MAX_ENTRIES]
    transcript = build_transcript(sample)

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    try:
        response = client.messages.parse(
            model="claude-opus-5",
            max_tokens=2048,
            output_config={"effort": "low"},
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": transcript}],
            output_format=AISummaryResult,
        )
    except anthropic.APIError as exc:
        raise AISummaryError(f"Claude API request failed: {exc}") from exc

    return response.parsed_output, len(sample)
