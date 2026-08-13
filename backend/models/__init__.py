"""
backend/models/__init__.py
"""
from .request import PredictRequest
from .response import PredictResponse, HealthResponse

__all__ = ["PredictRequest", "PredictResponse", "HealthResponse"]
