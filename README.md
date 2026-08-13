# AutismMaxxing

AutismMaxxing is a full-stack ASD screening application that predicts the likelihood of Autism Spectrum Disorder using an AQ-10 style questionnaire and demographic background data.

It includes:
- a FastAPI backend that runs the trained ML model
- a React + Vite frontend for the screening flow
- a model pipeline for preprocessing and inference
- an HTML prototype version included in the repository for reference

## Project Structure

```text
AutismMaxxing/
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   ├── services/
│   │   └── predictor.py
│   └── utils/
│       └── preprocessing.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── public/
│   └── src/
├── autismmaxxing_empathetic_asd_screening.html
├── best_model.pkl
├── encoders.pkl
├── LICENSE
├── main.py
├── requirements.txt
├── smoke_test.py
├── train.csv
└── README.md
```

## Features

- AQ-10 questionnaire with binary responses
- Age, gender, ethnicity, country, jaundice, and family ASD fields
- Model-based ASD risk prediction
- Result screen with confidence percentage and interpretation
- CORS-enabled FastAPI backend for frontend integration

## Tech Stack

- Python
- FastAPI
- scikit-learn
- Pandas
- React
- Vite
- TypeScript

## Setup

### 1) Create a virtual environment

```bash
python -m venv .venv
```

Activate it:

Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```

Linux/macOS:
```bash
source .venv/bin/activate
```

### 2) Install Python dependencies

From the project root:

```bash
pip install -r requirements.txt
```

### 3) Install frontend dependencies

```bash
cd frontend
npm install
```

## Run the Backend

From the project root:

```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at:
- http://localhost:8000/docs
- http://localhost:8000/health
- http://localhost:8000/predict

## Run the Frontend

Open a new terminal, then run:

```bash
cd frontend
npm run dev
```

The frontend is usually served at:
- http://localhost:5173

## Smoke Test

You can run a quick API smoke test:

```bash
python smoke_test.py
```

This sends a sample payload to the FastAPI app and prints the health and prediction responses.

## Model Notes

The application uses trained model artifacts:
- `best_model.pkl`
- `encoders.pkl`

These are loaded by the backend and used to preprocess and score questionnaire inputs before returning a prediction.

## Important Note

This project is intended for educational and screening purposes only. It is not a professional clinical diagnosis tool.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
