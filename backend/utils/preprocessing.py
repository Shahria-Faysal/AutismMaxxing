"""
backend/utils/preprocessing.py
Converts a PredictRequest into the 19-column pandas DataFrame expected by the
trained RandomForestClassifier (feature_names_in_ order confirmed by inspection):

    ['A1_Score','A2_Score','A3_Score','A4_Score','A5_Score',
     'A6_Score','A7_Score','A8_Score','A9_Score','A10_Score',
     'age','gender','ethnicity','jaundice','austim',
     'contry_of_res','used_app_before','result','relation']

Label encoders (from encoders.pkl) handle:
    gender         → classes_: ['f', 'm']
    ethnicity      → classes_: ['Asian','Black','Hispanic','Latino',
                                'Middle Eastern ','Others','Pasifika',
                                'South Asian','Turkish','White-European','others']
    jaundice       → classes_: ['no', 'yes']
    austim         → classes_: ['no', 'yes']
    contry_of_res  → classes_: [list of 54 country strings]
    used_app_before→ classes_: ['no', 'yes']
    relation       → classes_: ['Others', 'Self']
"""
from __future__ import annotations

import pandas as pd

from backend.models.request import PredictRequest
from backend.services.predictor import get_encoders


# ---------------------------------------------------------------------------
# Static look-up tables (HTML form values → training data values)
# ---------------------------------------------------------------------------

_GENDER_MAP: dict[str, str] = {
    "male":   "m",
    "female": "f",
    "other":  "f",   # encoder only has 'f' / 'm'; map unseen → 'f'
}

_ETHNICITY_MAP: dict[str, str] = {
    "asian":    "Asian",
    "black":    "Black",
    "hispanic": "Hispanic",
    "white":    "White-European",
    "other":    "others",
}

_COUNTRY_MAP: dict[str, str] = {
    "us":    "United States",
    "uk":    "United Kingdom",
    "ca":    "Canada",
    "au":    "Australia",
    "other": "United States",   # encoder fallback
}

_RELATION_MAP: dict[str, str] = {
    "self":                "Self",
    "parent":              "Others",
    "relative":            "Others",
    "health_professional": "Others",
    "other":               "Others",
}

# Training column order (must match feature_names_in_ exactly)
_FEATURE_ORDER = [
    "A1_Score", "A2_Score", "A3_Score", "A4_Score", "A5_Score",
    "A6_Score", "A7_Score", "A8_Score", "A9_Score", "A10_Score",
    "age", "gender", "ethnicity", "jaundice", "austim",
    "contry_of_res", "used_app_before", "result", "relation",
]


# ---------------------------------------------------------------------------
# Helper: safely transform a single value through a LabelEncoder,
# falling back to the first known class if the value is unseen.
# ---------------------------------------------------------------------------

def _safe_transform(encoder, value: str) -> int:
    known_classes: list[str] = list(encoder.classes_)
    if value not in known_classes:
        value = known_classes[0]
    return int(encoder.transform([value])[0])


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def build_feature_dataframe(req: PredictRequest) -> tuple[pd.DataFrame, int]:
    """
    Convert a validated PredictRequest into a single-row DataFrame ready for
    inference, plus the raw AQ-10 integer score for the response payload.

    Parameters
    ----------
    req : PredictRequest

    Returns
    -------
    df : pd.DataFrame
        Shape (1, 19) with columns in the exact training order.
    aq_score : int
        Sum of the 10 AQ binary answers (0–10).
    """
    encoders = get_encoders()

    # ── 1. Map raw string values from the form ───────────────────────────────
    gender_raw    = _GENDER_MAP.get(req.gender, "m")
    ethnicity_raw = _ETHNICITY_MAP.get(req.ethnicity, "others")
    country_raw   = _COUNTRY_MAP.get(req.country, "United States")
    relation_raw  = _RELATION_MAP.get(req.relation, "Others")
    jaundice_raw  = "yes" if req.jaundice else "no"
    austim_raw    = "yes" if req.family_asd else "no"
    used_app_raw  = "yes" if req.used_app_before else "no"

    # ── 2. Calculate AQ-10 score (sum of binary answers) ────────────────────
    aq_score: int = sum([
        req.a1_score, req.a2_score, req.a3_score, req.a4_score,
        req.a5_score, req.a6_score, req.a7_score, req.a8_score,
        req.a9_score, req.a10_score,
    ])

    # ── 3. Build raw feature dict (non-encoded) ───────────────────────────────
    raw: dict = {
        "A1_Score":        req.a1_score,
        "A2_Score":        req.a2_score,
        "A3_Score":        req.a3_score,
        "A4_Score":        req.a4_score,
        "A5_Score":        req.a5_score,
        "A6_Score":        req.a6_score,
        "A7_Score":        req.a7_score,
        "A8_Score":        req.a8_score,
        "A9_Score":        req.a9_score,
        "A10_Score":       req.a10_score,
        "age":             req.age,
        "gender":          gender_raw,
        "ethnicity":       ethnicity_raw,
        "jaundice":        jaundice_raw,
        "austim":          austim_raw,
        "contry_of_res":   country_raw,
        "used_app_before": used_app_raw,
        "result":          float(aq_score),   # same as sum; model expects numeric
        "relation":        relation_raw,
    }

    # ── 4. Build DataFrame and apply Label Encoders ───────────────────────────
    df = pd.DataFrame([raw], columns=_FEATURE_ORDER)

    for col, encoder in encoders.items():
        if col in df.columns:
            df[col] = _safe_transform(encoder, df[col].iloc[0])

    return df, aq_score
