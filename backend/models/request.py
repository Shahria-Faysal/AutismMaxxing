"""
backend/models/request.py
Pydantic request schema for the ASD Screening prediction endpoint.
Mirrors the form fields from autismmaxxing_empathetic_asd_screening.html
(Section 1: AQ-10 + Section 2: Background Information).
"Special Assessment" is intentionally omitted.
"""
from typing import Literal, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Allowed literals – derived from the HTML dropdowns / radio buttons
# ---------------------------------------------------------------------------

GenderLiteral    = Literal["male", "female", "other"]
EthnicityLiteral = Literal["asian", "black", "hispanic", "white", "other"]
CountryLiteral   = Literal[
    "us", "uk", "ca", "au", "other"
]
RelationLiteral  = Literal["self", "parent", "relative", "health_professional", "other"]


class PredictRequest(BaseModel):
    """
    Full payload sent by the frontend when the user clicks 'See Results'.
    All field names use snake_case as they would appear in the JSON body.
    """

    # ── Section 1: AQ-10 ────────────────────────────────────────────────────
    # Each question is scored 0 (Disagree) or 1 (Agree).
    a1_score:  int = Field(..., ge=0, le=1, description="Q1 – 'Read between the lines'")
    a2_score:  int = Field(..., ge=0, le=1, description="Q2 – 'Notice car number plates'")
    a3_score:  int = Field(..., ge=0, le=1, description="Q3 – AQ-10 item 3")
    a4_score:  int = Field(..., ge=0, le=1, description="Q4 – AQ-10 item 4")
    a5_score:  int = Field(..., ge=0, le=1, description="Q5 – AQ-10 item 5")
    a6_score:  int = Field(..., ge=0, le=1, description="Q6 – AQ-10 item 6")
    a7_score:  int = Field(..., ge=0, le=1, description="Q7 – AQ-10 item 7")
    a8_score:  int = Field(..., ge=0, le=1, description="Q8 – AQ-10 item 8")
    a9_score:  int = Field(..., ge=0, le=1, description="Q9 – AQ-10 item 9")
    a10_score: int = Field(..., ge=0, le=1, description="Q10 – AQ-10 item 10")

    # ── Section 2: Background Information ───────────────────────────────────
    age:       int            = Field(..., ge=1, le=120, description="Age in years")
    gender:    GenderLiteral  = Field(..., description="Gender (male / female / other)")
    ethnicity: EthnicityLiteral = Field(
        "other", description="Ethnicity dropdown value from the form"
    )
    country:   CountryLiteral = Field(
        "other", description="Country of residence dropdown value"
    )
    jaundice:  bool = Field(
        False, description="Born with jaundice? (toggle in Section 2)"
    )
    family_asd: bool = Field(
        False, description="Family history of ASD? (toggle in Section 2)"
    )

    # ── Optional / metadata ─────────────────────────────────────────────────
    # 'used_app_before' is not surfaced in the current HTML; default to False.
    used_app_before: bool = Field(
        False, description="Has the user taken a screening app before?"
    )
    # Who is completing the test (maps to 'relation' in training data)
    relation: RelationLiteral = Field(
        "self", description="Respondent type"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "a1_score": 1, "a2_score": 0, "a3_score": 1, "a4_score": 1,
                "a5_score": 0, "a6_score": 1, "a7_score": 0, "a8_score": 1,
                "a9_score": 1, "a10_score": 0,
                "age": 28,
                "gender": "male",
                "ethnicity": "asian",
                "country": "us",
                "jaundice": False,
                "family_asd": False,
                "used_app_before": False,
                "relation": "self",
            }
        }
    }
