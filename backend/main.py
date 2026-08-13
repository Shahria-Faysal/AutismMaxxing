"""
backend/main.py
FastAPI application entry point for the AutismMaxxing ASD Screening API.

Run with:
    uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

The frontend should POST JSON to:
    http://localhost:8000/predict
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.models.request import PredictRequest
from backend.models.response import PredictResponse, HealthResponse
from backend.services.predictor import (
    run_prediction,
    is_model_loaded,
    is_encoders_loaded,
    model_type_name,
)
from backend.utils.preprocessing import build_feature_dataframe

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------

app = FastAPI(
    title="AutismMaxxing – ASD Screening API",
    description=(
        "FastAPI backend for the AutismMaxxing empathetic ASD screening tool. "
        "Accepts AQ-10 questionnaire answers and demographic data, then returns "
        "a prediction from a pre-trained RandomForestClassifier. "
        "Special Assessment logic is intentionally excluded."
    ),
    version="1.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS – allow the HTML frontend (served from any origin during development)
# Tighten `allow_origins` in production to the specific frontend domain.
# ---------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Service health check",
    tags=["system"],
)
def health_check() -> HealthResponse:
    """
    Returns the service status and whether the model / encoders loaded
    successfully. Use this endpoint to verify the backend is operational
    before submitting screening data.
    """
    return HealthResponse(
        status="ok" if (is_model_loaded() and is_encoders_loaded()) else "degraded",
        model_loaded=is_model_loaded(),
        encoders_loaded=is_encoders_loaded(),
        model_type=model_type_name(),
    )


@app.post(
    "/predict",
    response_model=PredictResponse,
    summary="Run ASD screening prediction",
    tags=["screening"],
)
def predict(payload: PredictRequest) -> PredictResponse:
    """
    Accepts the AQ-10 answers and background information from the screening
    form, pre-processes the data, and runs inference with the trained model.

    **Request body** – see `PredictRequest` schema.

    **Response** – see `PredictResponse` schema. The `message` and `headline`
    fields are ready to be displayed directly in the ResultsScreen component.

    Note: The "Special Assessment" section of the frontend is purely cosmetic
    and is NOT sent to or processed by this endpoint.
    """
    # Guard: ensure model and encoders are loaded
    if not is_model_loaded() or not is_encoders_loaded():
        raise HTTPException(
            status_code=503,
            detail=(
                "The prediction model is not available. "
                "Check /health for details."
            ),
        )

    try:
        # Pre-process: HTML form values → 19-feature DataFrame
        feature_df, aq_score = build_feature_dataframe(payload)

        # Inference
        prob_asd, prediction = run_prediction(feature_df)

        # Derive confidence (clamp for display safety)
        confidence = round(float(prob_asd) * 100, 2)

        # Human-readable output
        label, headline, message = _build_result_text(prob_asd, aq_score)

        return PredictResponse(
            aq_score=aq_score,
            probability=round(float(prob_asd), 4),
            confidence=confidence,
            label=label,
            headline=headline,
            message=message,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        ) from exc


# ---------------------------------------------------------------------------
# Internal helper
# ---------------------------------------------------------------------------

def _build_result_text(
    prob_asd: float,
    aq_score: int,
) -> tuple[str, str, str]:
    """
    Derive label, headline, and narrative message from model output.

    The thresholds below mirror conventional AQ-10 clinical guidance:
      - aq_score ≥ 6 or model probability ≥ 0.5 → ASD likely
    """
    is_asd = prob_asd >= 0.5  # model decision boundary

    if is_asd:
        label    = "ASD"
        headline = "High Likelihood"
        message  = (
            f"Based on your AQ-10 responses (score {aq_score}/10) and background "
            f"information, your profile aligns with traits commonly associated with "
            f"the autism spectrum (model confidence: {prob_asd:.1%}). "
            "This indicates a potential high likelihood of Autism Spectrum Disorder (ASD). "
            "We strongly recommend consulting a qualified healthcare professional for a "
            "formal assessment and personalised guidance."
        )
    else:
        label    = "Typical"
        headline = "Low Likelihood"
        message  = (
            f"Based on your AQ-10 responses (score {aq_score}/10) and background "
            f"information, your profile shows a low likelihood of Autism Spectrum Disorder "
            f"(model confidence: {prob_asd:.1%}). "
            "If you still have concerns or notice traits that affect your daily life, "
            "don't hesitate to discuss them with a primary care physician or mental health "
            "professional."
        )

    return label, headline, message
