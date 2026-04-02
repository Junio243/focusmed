# FocusMed AI Service (Python)

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /v1/recommendations`
- `POST /v1/study-plan`
- `POST /v1/content-insights`

All `POST` endpoints require `x-internal-token: focusmed-internal-token`.
