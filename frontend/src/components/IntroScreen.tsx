// src/components/IntroScreen.tsx — Welcome/intro page (Step 1 of 3)
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function IntroScreen() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow w-full max-w-[1140px] mx-auto px-4 md:px-6 py-16 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl bg-[--color-surface-container-lowest] rounded-xl shadow-[var(--shadow-level-1)] border border-[--color-outline-variant]/30 p-8 md:p-12 flex flex-col items-center text-center relative overflow-hidden fade-in-up">
          {/* Background blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[--color-primary-fixed]/20 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[--color-secondary-fixed]/20 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-8 w-full">
            {/* Headline */}
            <div className="flex flex-col gap-2">
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-[--color-primary]">
                Empathetic ASD Screening
              </h1>
              <p className="text-lg text-[--color-on-surface-variant] max-w-2xl mx-auto leading-relaxed">
                Understand your unique path with our modern AQ-10 screening tool. Quick, private, and professional.
              </p>
            </div>

            {/* Info card */}
            <div className="w-full bg-[--color-surface-container-low] rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 text-left border border-[--color-outline-variant]/20 shadow-sm">
              <div className="bg-[--color-primary-container] text-[--color-on-primary-container] p-4 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined text-[32px]">assignment</span>
              </div>
              <div>
                <h2 className="font-headline text-sm font-semibold text-[--color-primary] mb-1">About the AQ-10</h2>
                <p className="text-base text-[--color-on-surface-variant] leading-relaxed">
                  The Autism Spectrum Quotient (AQ-10) is a quick, preliminary screening tool designed to help
                  identify traits associated with the autism spectrum in adults. It consists of 10 carefully
                  selected questions to provide gentle, actionable insights.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4 mt-4 w-full">
              <button
                onClick={() => navigate('/screening')}
                aria-label="Begin ASD Screening"
                className="primary-button w-full md:w-auto"
              >
                Begin Screening
              </button>

              {/* Step indicator */}
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-xs text-[--color-tertiary]">Step 1 of 3: Introduction</span>
                <div className="flex gap-2">
                  <div className="w-12 h-2 rounded-full bg-[--color-secondary]" />
                  <div className="w-12 h-2 rounded-full bg-[--color-surface-variant]" />
                  <div className="w-12 h-2 rounded-full bg-[--color-surface-variant]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
