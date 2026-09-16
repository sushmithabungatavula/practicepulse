import re
from collections import Counter
from datetime import datetime

from app.models import Feedback

STOPWORDS = {
    "the", "a", "an", "and", "or", "but", "is", "was", "were", "are", "to", "of",
    "in", "on", "for", "with", "it", "this", "that", "i", "my", "her", "his",
    "their", "she", "he", "they", "very", "really", "so", "just", "as", "at",
    "be", "been", "have", "has", "had", "would", "could", "should", "more",
    "class", "classes", "instructor", "yoga", "we", "our", "you", "your",
    "me", "them", "not", "no", "yes", "get", "got", "much", "than", "also",
    "im", "its", "was", "will", "did", "do", "does", "how", "what", "when",
    "which", "who", "all", "some", "can", "up", "out", "if", "about", "like",
    "feel", "felt", "feeling",
}


def extract_themes(texts: list[str], top_n: int = 8) -> list[dict]:
    """Lightweight, no-AI keyword-frequency extraction over free-text feedback."""
    counter: Counter[str] = Counter()
    for text in texts:
        if not text:
            continue
        words = re.findall(r"[a-zA-Z']+", text.lower())
        for word in words:
            word = word.strip("'")
            if len(word) < 4 or word in STOPWORDS:
                continue
            counter[word] += 1
    return [{"word": w, "count": c} for w, c in counter.most_common(top_n)]


def month_key(dt: datetime) -> str:
    return dt.strftime("%Y-%m")


def build_monthly_trends(entries: list[Feedback]) -> list[dict]:
    buckets: dict[str, list[int]] = {}
    for entry in entries:
        key = month_key(entry.created_at)
        buckets.setdefault(key, []).append(entry.overall_rating)
    trends = []
    for key in sorted(buckets.keys()):
        ratings = buckets[key]
        trends.append({
            "month": key,
            "average_rating": round(sum(ratings) / len(ratings), 2),
            "review_count": len(ratings),
        })
    return trends[-12:]


def compute_engagement_score(average_rating: float, recommendation_rate: float, returning_rate: float) -> float:
    """Composite 0-100 score blending satisfaction, promoter rate, and retention."""
    rating_component = (average_rating / 5.0) * 100 if average_rating else 0
    score = (rating_component * 0.4) + (recommendation_rate * 0.4) + (returning_rate * 0.2)
    return round(score, 1)


def previous_period_growth(entries: list[Feedback]) -> float | None:
    """% change in review volume, most recent 30 days vs the 30 days before that."""
    if not entries:
        return None
    now = max((e.created_at for e in entries), default=datetime.utcnow())
    recent = [e for e in entries if (now - e.created_at).days <= 30]
    prior = [e for e in entries if 30 < (now - e.created_at).days <= 60]
    if not prior:
        return None if not recent else 100.0
    return round(((len(recent) - len(prior)) / len(prior)) * 100, 1)
