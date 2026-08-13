"""
backend/services/predictor.py
Loads the trained model and encoders at import time (module-level singletons)
and exposes a single `run_prediction` function consumed by the API router.
"""
from __future__ import annotations

import pickle
from pathlib import Path

# ---------------------------------------------------------------------------
# Paths – resolved relative to the project root (two levels up from this file)
# ---------------------------------------------------------------------------
_PROJECT_ROOT  = Path(__file__).resolve().parents[2]
MODEL_PATH     = _PROJECT_ROOT / "best_model.pkl"
ENCODERS_PATH  = _PROJECT_ROOT / "encoders.pkl"

# ---------------------------------------------------------------------------
# Module-level singletons (loaded once on first import, cached for all requests)
# ---------------------------------------------------------------------------
_model    = None
_encoders: dict | None = None
_load_error: str | None = None


def _load() -> None:
    """Attempt to load model and encoders; store any error for the health endpoint."""
    global _model, _encoders, _load_error
    try:
        with open(MODEL_PATH, "rb") as f:
            _model = pickle.load(f)
        with open(ENCODERS_PATH, "rb") as f:
            _encoders = pickle.load(f)
    except FileNotFoundError as exc:
        _load_error = f"File not found: {exc.filename}"
    except Exception as exc:
        _load_error = str(exc)


# Run on import
_load()


# ---------------------------------------------------------------------------
# Public accessors (used by preprocessing.py and main.py)
# ---------------------------------------------------------------------------

def get_model():
    """Return the loaded estimator or raise RuntimeError."""
    if _model is None:
        raise RuntimeError(
            f"Model could not be loaded. Reason: {_load_error}. "
            f"Expected path: {MODEL_PATH}"
        )
    return _model


def get_encoders() -> dict:
    """Return the encoders dict or raise RuntimeError."""
    if _encoders is None:
        raise RuntimeError(
            f"Encoders could not be loaded. Reason: {_load_error}. "
            f"Expected path: {ENCODERS_PATH}"
        )
    return _encoders


def is_model_loaded() -> bool:
    return _model is not None


def is_encoders_loaded() -> bool:
    return _encoders is not None


def model_type_name() -> str:
    if _model is None:
        return "not loaded"
    return type(_model).__name__


# ---------------------------------------------------------------------------
# Prediction helper
# ---------------------------------------------------------------------------

def run_prediction(feature_df) -> tuple[float, int]:
    """
    Run model inference on a pre-processed pandas DataFrame row.

    Returns
    -------
    prob_asd : float
        Probability of the positive (ASD) class.
    prediction : int
        Binary class label (0 = Typical, 1 = ASD).
    """
    model = get_model()
    proba = model.predict_proba(feature_df)[0]
    # index 1 = positive class (ASD = 1 from training)
    prob_asd: float = float(proba[1])
    prediction: int = int(model.predict(feature_df)[0])
    return prob_asd, prediction
