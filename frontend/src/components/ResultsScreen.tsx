// src/components/ResultsScreen.tsx — Displays prediction result from the backend
import { useLocation, useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import type { PredictResponse } from '../types'

export default function ResultsScreen() {
  const navigate = useNavigate()
  const location = useLocation()

  // Data passed via navigate('/results', { state: { result, name } })
  const result: PredictResponse | undefined = location.state?.result
  const name: string = location.state?.name ?? ''

  // If navigated directly (no data), redirect back to screening
  if (!result) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center flex-col gap-6 px-4">
          <span className="material-symbols-outlined text-[--color-on-surface-variant] text-6xl">
            sentiment_dissatisfied
          </span>
          <p className="text-lg text-[--color-on-surface-variant]">
            No results found. Please complete the screening first.
          </p>
          <button
            onClick={() => navigate('/screening')}
            className="bg-[--color-primary] text-white font-semibold py-2 px-6 rounded-full hover:scale-105 transition-all active:scale-95"
          >
            Go to Screening
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  const isASD = result.label === 'ASD'
  const isZakt = name.toLowerCase().trim() === 'zakt'

  // Conic gradient angle for the result circle (probability → degrees)
  const degrees = Math.round(result.probability * 360)
  const circleColor = isASD ? 'var(--color-error)' : 'var(--color-secondary)'

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-[1140px] mx-auto px-4 md:px-6 py-16 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-[--color-surface] rounded-xl shadow-[var(--shadow-level-1)] border border-[--color-outline-variant] p-8 md:p-16 flex flex-col items-center text-center gap-8 fade-in-up">

          {/* ── Result circle ──────────────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            <div
              className="result-circle shadow-[var(--shadow-level-1)]"
              style={{
                background: `conic-gradient(${circleColor} ${degrees}deg, var(--color-surface-container-highest) 0)`,
              }}
              aria-label={`Score: ${result.aq_score} out of 10`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <span className="font-headline text-4xl font-bold text-[--color-primary]">
                  {result.aq_score}/10
                </span>
                <span className="text-xs font-semibold text-[--color-on-surface-variant] uppercase tracking-wider mt-1">
                  Score
                </span>
              </div>
            </div>
            <h1 className="font-headline text-3xl font-bold text-[--color-on-surface] mt-2">
              {result.headline}
            </h1>
            <p className="text-sm font-semibold text-[--color-on-surface-variant]">
              Model confidence: <span className="text-[--color-primary] font-bold">{result.confidence.toFixed(1)}%</span>
            </p>
          </div>

          {/* ── Narrative message ─────────────────────────────────────────── */}
          <div className="text-left bg-[--color-surface-container-low] rounded-lg p-6 w-full space-y-3">
            <p className="text-lg text-[--color-on-surface-variant] leading-relaxed">
              {result.message}
            </p>

            {/* Easter egg: only shown when name is "Zakt" */}
            {isZakt && (
              <p className="text-base font-semibold text-[--color-primary] italic mt-3 border-l-4 border-[--color-secondary] pl-4">
                ✨ You're great regardless.
              </p>
            )}
          </div>

          {/* ── Disclaimer ───────────────────────────────────────────────── */}
          <div
            className="w-full bg-[--color-error-container] border border-[--color-error]/20 rounded-lg p-4 flex items-start gap-3 text-left"
            role="note"
            aria-label="Medical disclaimer"
          >
            <span className="material-symbols-outlined text-[--color-on-error-container] shrink-0 mt-0.5">info</span>
            <p className="text-sm text-[--color-on-error-container]">
              <strong>Important:</strong> This is a screening tool, not a clinical diagnosis. Please consult a
              qualified health professional for a formal assessment and personalised guidance.
            </p>
          </div>

          {/* ── Action buttons ───────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
              onClick={() => navigate('/screening')}
              aria-label="Retake the screening"
              className="border border-[--color-primary] text-[--color-primary] bg-transparent font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[--color-surface-container-high] transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">refresh</span>
              Retake Screening
            </button>
            <button
              onClick={() => window.print()}
              aria-label="Download or print report"
              className="bg-[--color-primary] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[--color-primary]/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined">download</span>
              Download Report
            </button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
