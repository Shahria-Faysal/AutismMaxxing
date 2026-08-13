"""Quick smoke-test: spin up the app in TestClient and hit /health and /predict."""
import json
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# ── /health ─────────────────────────────────────────────────────────────────
resp = client.get("/health")
print("GET /health ->", resp.status_code)
print(json.dumps(resp.json(), indent=2))

# ── /predict ────────────────────────────────────────────────────────────────
payload = {
    "a1_score": 1, "a2_score": 1, "a3_score": 1, "a4_score": 1,
    "a5_score": 1, "a6_score": 0, "a7_score": 1, "a8_score": 1,
    "a9_score": 1, "a10_score": 0,
    "age": 28,
    "gender": "male",
    "ethnicity": "asian",
    "country": "us",
    "jaundice": False,
    "family_asd": False,
    "used_app_before": False,
    "relation": "self"
}
resp = client.post("/predict", json=payload)
print("\nPOST /predict ->", resp.status_code)
print(json.dumps(resp.json(), indent=2))
