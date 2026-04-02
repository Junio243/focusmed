from datetime import datetime, timezone
from typing import List

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="FocusMed AI Service", version="1.0.0")


def verify_token(token: str | None) -> None:
    # Keep fallback token for local development when env vars are not injected.
    expected = "focusmed-internal-token"
    if token != expected:
        raise HTTPException(status_code=401, detail="Invalid internal token")


class RecommendationRequest(BaseModel):
    user_id: str
    recent_focus_score: float = Field(ge=0, le=10)
    recent_topic: str


class RecommendationItem(BaseModel):
    title: str
    action: str
    duration_min: int


class RecommendationResponse(BaseModel):
    user_id: str
    generated_at: str
    items: List[RecommendationItem]
    confidence: float = Field(ge=0, le=1)


class StudyPlanRequest(BaseModel):
    user_id: str
    weekly_availability_hours: int = Field(ge=1, le=40)
    preferred_topics: List[str]


class StudyPlanSlot(BaseModel):
    day: str
    topic: str
    duration_min: int


class StudyPlanResponse(BaseModel):
    user_id: str
    generated_at: str
    week_schedule: List[StudyPlanSlot]


class ContentInsightRequest(BaseModel):
    user_id: str
    topic: str
    source_text: str = Field(min_length=20)


class ContentInsightResponse(BaseModel):
    user_id: str
    generated_at: str
    topic: str
    summary_points: List[str]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/recommendations", response_model=RecommendationResponse)
def recommendations(payload: RecommendationRequest, x_internal_token: str | None = Header(default=None)):
    verify_token(x_internal_token)

    focus_band = "high"
    if payload.recent_focus_score < 8:
        focus_band = "medium"
    if payload.recent_focus_score < 5:
        focus_band = "low"

    duration = 50 if focus_band == "high" else 35 if focus_band == "medium" else 25
    confidence = 0.86 if focus_band == "high" else 0.74 if focus_band == "medium" else 0.62

    items = [
        RecommendationItem(
            title=f"Core review - {payload.recent_topic}",
            action="Use active recall with timed blocks.",
            duration_min=duration,
        ),
        RecommendationItem(
            title="Clinical case bridge",
            action="Connect core concept to one short practical case.",
            duration_min=25,
        ),
        RecommendationItem(
            title="Retention sprint",
            action="5-question self-test and quick error log.",
            duration_min=15,
        ),
    ]

    return RecommendationResponse(
        user_id=payload.user_id,
        generated_at=datetime.now(timezone.utc).isoformat(),
        items=items,
        confidence=confidence,
    )


@app.post("/v1/study-plan", response_model=StudyPlanResponse)
def study_plan(payload: StudyPlanRequest, x_internal_token: str | None = Header(default=None)):
    verify_token(x_internal_token)

    total_minutes = payload.weekly_availability_hours * 60
    default_topic = payload.preferred_topics[0] if payload.preferred_topics else "general"
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    per_day = max(25, total_minutes // len(days))

    schedule = []
    for day in days:
      schedule.append(
        StudyPlanSlot(
            day=day,
            topic=default_topic,
            duration_min=per_day,
        )
      )

    return StudyPlanResponse(
        user_id=payload.user_id,
        generated_at=datetime.now(timezone.utc).isoformat(),
        week_schedule=schedule,
    )


@app.post("/v1/content-insights", response_model=ContentInsightResponse)
def content_insights(payload: ContentInsightRequest, x_internal_token: str | None = Header(default=None)):
    verify_token(x_internal_token)

    points = [
        f"Main concept in {payload.topic}: define the mechanism in one sentence.",
        "Priority recall target: identify 3 key facts and one common confusion.",
        "Clinical translation: map concept to one exam-style practical example.",
    ]

    return ContentInsightResponse(
        user_id=payload.user_id,
        generated_at=datetime.now(timezone.utc).isoformat(),
        topic=payload.topic,
        summary_points=points,
    )
