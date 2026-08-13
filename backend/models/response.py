"""
backend/models/response.py
Pydantic response schemas returned by the prediction and health endpoints.
"""
from typing import Literal
from pydantic import BaseModel, Field


class PredictResponse(BaseModel):
    """
    Structured response returned from POST /predict.
    The frontend ResultsScreen reads these fields to populate the UI.
    """

    # Raw AQ-10 total (0-10), shown as "7/10" in the result circle
    aq_score: int = Field(
        ..., ge=0, le=10,
        description="Raw AQ-10 score (sum of the 10 binary answers)"
    )

    # Probability of ASD (positive class), range 0–1
    probability: float = Field(
        ..., ge=0.0, le=1.0,
        description="Model probability for ASD (0 = no ASD, 1 = ASD)"
    )

    # Confidence as a percentage for display convenience
    confidence: float = Field(
        ..., ge=0.0, le=100.0,
        description="Confidence as a percentage (probability × 100)"
    )

    # Predicted class label
    label: Literal["ASD", "Typical"] = Field(
        ..., description="Predicted class: 'ASD' or 'Typical'"
    )

    # Human-readable text for the ResultsScreen paragraph
    message: str = Field(
        ..., description="Narrative result message for the UI"
    )

    # Short headline displayed as the h1 in ResultsScreen
    headline: str = Field(
        ..., description="Short risk headline (e.g. 'High Likelihood')"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "aq_score": 7,
                "probability": 0.82,
                "confidence": 82.0,
                "label": "ASD",
                "message": (
                    "Based on your responses, your profile aligns strongly with traits "
                    "associated with the autism spectrum. This is a screening tool, not "
                    "a clinical diagnosis — please consult a qualified professional."
                ),
                "headline": "High Likelihood",
            }
        }
    }


class HealthResponse(BaseModel):
    """Response from GET /health."""

    status: str = Field(..., description="'ok' when the service is healthy")
    model_loaded: bool = Field(
        ..., description="True when best_model.pkl was loaded successfully"
    )
    encoders_loaded: bool = Field(
        ..., description="True when encoders.pkl was loaded successfully"
    )
    model_type: str = Field(
        ..., description="Python class name of the loaded estimator"
    )
