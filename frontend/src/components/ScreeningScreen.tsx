// src/components/ScreeningScreen.tsx — AQ-10 questionnaire + background info + API call
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import type { PredictRequest, PredictResponse } from '../types'

// ── AQ-10 questions (from the original AQ-10 instrument) ─────────────────────
const AQ_QUESTIONS = [
  "I find it easy to 'read between the lines' when someone is talking to me.",
  "I usually notice car number plates or similar strings of information.",
  "I find it difficult to work out people's intentions.",
  "I prefer to do things the same way over and over again.",
  "I frequently find that I don't know how to keep a conversation going.",
  "I notice patterns in things all the time.",
  "I find it difficult to imagine what it would be like to be someone else.",
  "I like to collect information about categories of things.",
  "I find social situations easy.",
  "I find it hard to make new friends.",
]

type AQScore = 0 | 1

const DEFAULT_FORM: PredictRequest = {
  a1_score: 0, a2_score: 0, a3_score: 0, a4_score: 0, a5_score: 0,
  a6_score: 0, a7_score: 0, a8_score: 0, a9_score: 0, a10_score: 0,
  age: 25,
  gender: 'male',
  ethnicity: 'other',
  country: 'other',
  jaundice: false,
  family_asd: false,
  used_app_before: false,
  relation: 'self',
}

const AQ_KEYS = [
  'a1_score', 'a2_score', 'a3_score', 'a4_score', 'a5_score',
  'a6_score', 'a7_score', 'a8_score', 'a9_score', 'a10_score',
] as const

export default function ScreeningScreen() {
  const navigate = useNavigate()
  const [form, setForm] = useState<PredictRequest>(DEFAULT_FORM)
  const [fullName, setFullName] = useState('Zakt')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setAQ = (index: number, val: AQScore) => {
    setForm(prev => ({ ...prev, [AQ_KEYS[index]]: val }))
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const detail = await res.json()
        throw new Error(detail.detail ?? 'Prediction failed')
      }
      const data: PredictResponse = await res.json()
      navigate('/results', { state: { result: data, name: fullName } })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-3xl mx-auto px-4 md:px-6 py-8">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-[--color-on-surface-variant]">Your Progress</span>
            <span className="text-sm font-bold text-[--color-primary]">50%</span>
          </div>
          <div className="h-3 w-full bg-[--color-surface-container-highest] rounded-full overflow-hidden">
            <div className="h-full bg-[--color-secondary-fixed] transition-all duration-700 ease-out rounded-full w-1/2" />
          </div>
        </div>

        <div className="space-y-16">

          {/* ── Section 1: AQ-10 ─────────────────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-headline text-2xl font-semibold text-[--color-primary]">Section 1: AQ-10</h2>
              <div className="tooltip relative inline-flex items-center justify-center cursor-help">
                <span className="material-symbols-outlined text-[--color-on-surface-variant] text-lg">help</span>
                <div className="tooltip-text absolute bottom-full mb-2 w-48 bg-[--color-inverse-surface] text-[--color-inverse-on-surface] text-xs p-2 rounded shadow-lg text-center z-10 left-1/2 -translate-x-1/2">
                  The Autism Spectrum Quotient (AQ-10) is a quick screening tool to help identify autistic traits.
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {AQ_QUESTIONS.map((question, i) => {
                const currentVal = form[AQ_KEYS[i]] as AQScore
                return (
                  <div
                    key={i}
                    className="question-card bg-[--color-surface] p-6 rounded-xl fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <p className="text-lg text-[--color-on-surface] mb-4 leading-relaxed">
                      {i + 1}. {question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(['Agree', 'Disagree'] as const).map((label) => {
                        const val: AQScore = label === 'Agree' ? 1 : 0
                        const selected = currentVal === val
                        return (
                          <label key={label} className="aq-option cursor-pointer" aria-label={label}>
                            <input
                              type="radio"
                              name={`q${i + 1}`}
                              className="sr-only"
                              checked={selected}
                              onChange={() => setAQ(i, val)}
                            />
                            <div
                              className={`px-4 py-3 rounded-lg border-2 text-center text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2
                                ${selected
                                  ? 'bg-[--color-secondary] text-white border-[--color-secondary]'
                                  : 'border-[--color-outline-variant] text-[--color-on-surface-variant] hover:bg-[--color-surface-container-low]'
                                }`}
                            >
                              {selected && <span className="material-symbols-outlined text-base">check</span>}
                              {label}
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── Section 2: Background Information ───────────────────────────── */}
          <section>
            <h2 className="font-headline text-2xl font-semibold text-[--color-primary] mb-4">
              Section 2: Background Information
            </h2>
            <div className="question-card bg-[--color-surface] p-6 rounded-xl space-y-4 fade-in-up">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-sm font-semibold text-[--color-on-surface-variant]" htmlFor="full-name">
                    Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    aria-label="Full name"
                    className="w-full px-4 py-3 rounded-lg border border-[--color-outline-variant] bg-[--color-surface-container-lowest] focus:ring-2 focus:ring-[--color-primary-fixed] focus:border-[--color-primary] text-[--color-on-surface] text-base transition-shadow outline-none"
                  />
                </div>

                {/* Age */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[--color-on-surface-variant]" htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    min={1} max={120}
                    value={form.age}
                    onChange={e => setForm(prev => ({ ...prev, age: parseInt(e.target.value) || 1 }))}
                    aria-label="Age"
                    className="w-full px-4 py-3 rounded-lg border border-[--color-outline-variant] bg-[--color-surface-container-lowest] focus:ring-2 focus:ring-[--color-primary-fixed] focus:border-[--color-primary] text-[--color-on-surface] text-base transition-shadow outline-none"
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[--color-on-surface-variant]">Gender</label>
                  <div className="flex bg-[--color-surface-container-highest] p-1 rounded-lg">
                    {(['male', 'female', 'other'] as const).map(g => (
                      <label key={g} className="flex-1 cursor-pointer relative" aria-label={g}>
                        <input
                          type="radio"
                          name="gender"
                          className="peer sr-only"
                          checked={form.gender === g}
                          onChange={() => setForm(prev => ({ ...prev, gender: g }))}
                        />
                        <div className="text-center py-2 px-3 rounded-md text-sm font-semibold text-[--color-on-surface-variant] peer-checked:bg-[--color-surface] peer-checked:text-[--color-primary] peer-checked:shadow-sm transition-all duration-200 capitalize">
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Ethnicity */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[--color-on-surface-variant]" htmlFor="ethnicity">
                    Ethnicity
                  </label>
                  <select
                    id="ethnicity"
                    value={form.ethnicity}
                    onChange={e => setForm(prev => ({ ...prev, ethnicity: e.target.value as PredictRequest['ethnicity'] }))}
                    aria-label="Select ethnicity"
                    className="w-full px-4 py-3 rounded-lg border border-[--color-outline-variant] bg-[--color-surface-container-lowest] text-[--color-on-surface] text-base appearance-none outline-none focus:ring-2 focus:ring-[--color-primary-fixed]"
                  >
                    <option value="" disabled>Select ethnicity...</option>
                    <option value="asian">Asian</option>
                    <option value="black">Black</option>
                    <option value="hispanic">Hispanic / Latino</option>
                    <option value="white">White</option>
                    <option value="other">Other / Prefer not to say</option>
                  </select>
                </div>

                {/* Country */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-[--color-on-surface-variant]" htmlFor="country">
                    Country
                  </label>
                  <select
                    id="country"
                    value={form.country}
                    onChange={e => setForm(prev => ({ ...prev, country: e.target.value as PredictRequest['country'] }))}
                    aria-label="Select country"
                    className="w-full px-4 py-3 rounded-lg border border-[--color-outline-variant] bg-[--color-surface-container-lowest] text-[--color-on-surface] text-base appearance-none outline-none focus:ring-2 focus:ring-[--color-primary-fixed]"
                  >
                    <option value="" disabled>Select country...</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <hr className="border-t border-[--color-outline-variant] opacity-50" />

              {/* Toggle switches */}
              <div className="space-y-4">
                {[
                  { label: 'Were you born with jaundice?', key: 'jaundice' },
                  { label: 'Is there a family history of ASD?', key: 'family_asd' },
                ].map(({ label, key }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-base text-[--color-on-surface]">{label}</span>
                    <div className="toggle-switch" aria-label={label}>
                      <input
                        type="checkbox"
                        checked={form[key as keyof PredictRequest] as boolean}
                        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.checked }))}
                        aria-label={label}
                      />
                      <span className="toggle-switch-track" aria-hidden="true" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* ── Special Assessment trigger ────────────────────────────────── */}
          <section>
            <div className=" flex items-center justify-between p-5 gap-4">
              <div>
                <h2 className="font-headline text-xl font-bold ">⚡ Special Evaluation</h2>
                <p className="text-sm  mt-1">Unlock a deeper, more detailed assessment experience.</p>
              </div>
              <button
                onClick={() => navigate('/special-assessment')}
                aria-label="Open Special Evaluation"
                className="special-assessment-button"
              >
                Special Evaluation
              </button>
            </div>
          </section>

          {/* ── Error ─────────────────────────────────────────────────────── */}
          {error && (
            <div className="bg-[--color-error-container] border border-[--color-error]/30 rounded-lg p-4 flex items-start gap-3 text-left" role="alert">
              <span className="material-symbols-outlined text-[--color-on-error-container] shrink-0 mt-0.5">error</span>
              <p className="text-sm text-[--color-on-error-container]"><strong>Error:</strong> {error}</p>
            </div>
          )}

          {/* ── Submit button ──────────────────────────────────────────────── */}
          <div className="pt-4 flex justify-center pb-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              aria-label="See Results"
              className="primary-button flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner !w-5 !h-5 !border-2" />
                  Analysing…
                </>
              ) : (
                <>
                  See Results
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
