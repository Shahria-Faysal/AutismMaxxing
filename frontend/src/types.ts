// src/types.ts — Shared TypeScript types for the app

/** Matches the Pydantic PredictRequest schema in backend/models/request.py */
export interface PredictRequest {
  a1_score: 0 | 1;
  a2_score: 0 | 1;
  a3_score: 0 | 1;
  a4_score: 0 | 1;
  a5_score: 0 | 1;
  a6_score: 0 | 1;
  a7_score: 0 | 1;
  a8_score: 0 | 1;
  a9_score: 0 | 1;
  a10_score: 0 | 1;
  age: number;
  gender: 'male' | 'female' | 'other';
  ethnicity: 'asian' | 'black' | 'hispanic' | 'white' | 'other';
  country: 'us' | 'uk' | 'ca' | 'au' | 'other';
  jaundice: boolean;
  family_asd: boolean;
  used_app_before: boolean;
  relation: 'self' | 'parent' | 'relative' | 'health_professional' | 'other';
}

/** Matches the Pydantic PredictResponse schema in backend/models/response.py */
export interface PredictResponse {
  aq_score: number;
  probability: number;
  confidence: number;
  label: 'ASD' | 'Typical';
  message: string;
  headline: string;
}
