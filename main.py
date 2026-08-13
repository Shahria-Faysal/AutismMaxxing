import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

# Initialize FastAPI app
app = FastAPI(
    title="AutismMaxxing Backend API",
    description="FastAPI Backend for predicting Autism Spectrum Disorder (ASD) using a trained Random Forest model.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and encoders
model = None
encoders = None

@app.on_event("startup")
def load_resources():
    global model, encoders
    try:
        with open("best_model.pkl", "rb") as f:
            model = pickle.load(f)
        with open("encoders.pkl", "rb") as f:
            encoders = pickle.load(f)
        print("Model and Encoders loaded successfully.")
    except Exception as e:
        print(f"Error loading model or encoders: {e}")
        raise RuntimeError("Model files not found or corrupt.")

# Input Schema for ASD Screening
class ASDScreeningInput(BaseModel):
    A1_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 1 (0 or 1)")
    A2_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 2 (0 or 1)")
    A3_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 3 (0 or 1)")
    A4_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 4 (0 or 1)")
    A5_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 5 (0 or 1)")
    A6_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 6 (0 or 1)")
    A7_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 7 (0 or 1)")
    A8_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 8 (0 or 1)")
    A9_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 9 (0 or 1)")
    A10_Score: int = Field(..., ge=0, le=1, description="Score for AQ-10 Question 10 (0 or 1)")
    age: int = Field(..., ge=1, le=120, description="Age of the individual in years")
    gender: str = Field(..., description="Gender ('male', 'female', or shorthand 'm', 'f')")
    ethnicity: str = Field(..., description="Ethnicity (e.g., 'asian', 'black', 'white', etc.)")
    jaundice: str = Field(..., description="Born with jaundice? ('yes' / 'no')")
    autism: str = Field(..., description="Family history of autism? ('yes' / 'no')")
    country: str = Field(..., description="Country of residence (e.g., 'United States', 'India', 'us', 'uk', etc.)")
    used_app_before: Optional[str] = Field("no", description="Used screening app before? ('yes' / 'no')")
    relation: Optional[str] = Field("Self", description="Who is completing the test? ('Self', 'Others', etc.)")

# Response Schema
class ASDScreeningResponse(BaseModel):
    score: int
    asd_likelihood: str
    asd_probability: float
    message: str

def preprocess_input(data: ASDScreeningInput):
    # 1. Map Gender to encoder format ('f', 'm')
    g = data.gender.lower().strip()
    gender_mapped = 'f' if g in ['female', 'f'] else 'm'

    # 2. Map Ethnicity to encoder classes
    eth = data.ethnicity.lower().strip()
    ethnicity_mapping = {
        "asian": "Asian",
        "black": "Black",
        "hispanic": "Hispanic",
        "latino": "Latino",
        "middle eastern": "Middle Eastern ",
        "others": "others",
        "other": "others",
        "white": "White-European",
        "white-european": "White-European",
        "turkish": "Turkish",
        "pasifika": "Pasifika",
        "south asian": "South Asian"
    }
    # Resolve or default to "others"
    ethnicity_mapped = ethnicity_mapping.get(eth, "others")

    # 3. Map Jaundice and Autism Family History
    jaundice_mapped = 'yes' if data.jaundice.lower().strip() in ['yes', 'y', 'true'] else 'no'
    autism_mapped = 'yes' if data.autism.lower().strip() in ['yes', 'y', 'true'] else 'no'

    # 4. Map Country of Residence
    country_input = data.country.lower().strip()
    country_mapping = {
        "us": "United States",
        "united states": "United States",
        "usa": "United States",
        "uk": "United Kingdom",
        "united kingdom": "United Kingdom",
        "great britain": "United Kingdom",
        "ca": "Canada",
        "canada": "Canada",
        "au": "Australia",
        "australia": "Australia",
        "in": "India",
        "india": "India",
        "vn": "Vietnam",
        "vietnam": "Vietnam",
        "viet nam": "Vietnam",
        "nz": "New Zealand",
        "new zealand": "New Zealand",
        "at": "Austria",
        "austria": "Austria",
        "za": "South Africa",
        "south africa": "South Africa"
    }
    # Get list of classes from country encoder
    country_classes = list(encoders['contry_of_res'].classes_)
    
    # Try mapping abbreviation first
    resolved_country = country_mapping.get(country_input)
    
    # If not in mapping, check case-insensitive match in encoder classes
    if not resolved_country:
        for val in country_classes:
            if val.lower() == country_input:
                resolved_country = val
                break
                
    # Fallback to "United States" if the country is not supported by the model's encoder
    if resolved_country not in country_classes:
        resolved_country = "United States"

    # 5. Map Used App Before
    used_app_mapped = 'yes' if data.used_app_before.lower().strip() in ['yes', 'y', 'true'] else 'no'

    # 6. Map Relation
    rel = data.relation.lower().strip()
    relation_mapped = 'Self' if rel in ['self', 'myself'] else 'Others'

    # 7. Calculate result (sum of AQ-10 scores)
    result_calculated = float(sum([
        data.A1_Score, data.A2_Score, data.A3_Score, data.A4_Score, data.A5_Score,
        data.A6_Score, data.A7_Score, data.A8_Score, data.A9_Score, data.A10_Score
    ]))

    # Construct feature dictionary in the exact training column order
    feature_dict = {
        'A1_Score': data.A1_Score,
        'A2_Score': data.A2_Score,
        'A3_Score': data.A3_Score,
        'A4_Score': data.A4_Score,
        'A5_Score': data.A5_Score,
        'A6_Score': data.A6_Score,
        'A7_Score': data.A7_Score,
        'A8_Score': data.A8_Score,
        'A9_Score': data.A9_Score,
        'A10_Score': data.A10_Score,
        'age': data.age,
        'gender': gender_mapped,
        'ethnicity': ethnicity_mapped,
        'jaundice': jaundice_mapped,
        'austim': autism_mapped,
        'contry_of_res': resolved_country,
        'used_app_before': used_app_mapped,
        'result': result_calculated,
        'relation': relation_mapped
    }

    # Convert to DataFrame
    df_row = pd.DataFrame([feature_dict])

    # Apply label encoders
    for col, encoder in encoders.items():
        try:
            df_row[col] = encoder.transform(df_row[col])
        except Exception as e:
            # Fallback map to first class if unseen label slips through
            df_row[col] = encoder.transform([encoder.classes_[0]])

    return df_row, int(result_calculated)

@app.post("/predict", response_model=ASDScreeningResponse)
def predict_asd(data: ASDScreeningInput):
    if model is None or encoders is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    try:
        # Preprocess & Encode features
        processed_df, score = preprocess_input(data)

        # Make prediction
        prediction = model.predict(processed_df)[0]
        probabilities = model.predict_proba(processed_df)[0]
        asd_prob = float(probabilities[1])

        # Determine prediction feedback
        if prediction == 1 or asd_prob >= 0.5:
            likelihood = "High Likelihood"
            message = (
                "Based on the analysis, your profile aligns with traits associated with the autism spectrum. "
                "This indicates a potential high likelihood of Autism Spectrum Disorder (ASD). "
                "We recommend consulting with a healthcare professional for a formal assessment."
            )
        else:
            likelihood = "Low Likelihood"
            message = (
                "Based on the analysis, your profile shows a low likelihood of Autism Spectrum Disorder (ASD). "
                "If you still have concerns, we recommend discussing them with a primary care physician."
            )

        return ASDScreeningResponse(
            score=score,
            asd_likelihood=likelihood,
            asd_probability=asd_prob,
            message=message
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}
