// src/components/SpecialAssessmentPage.tsx
// Instant troll/surprise page — no form submission, pure visual chaos 🎉
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'

const QUESTIONS = [
  {
    id: 'valorant',
    text: 'You play Valorant? 🔫',
    roast: "Diagnosed. Touch grass immediately.",
    emoji: '💀',
  },
  {
    id: 'clash',
    text: 'You play Clash Royale? 👑',
    roast: "Please reconsider your life choices, bestie.",
    emoji: '🤡',
  },
  {
    id: 'frass',
    text: "You're friends with Frass? 🤝",
    roast: "Certified sigma. Respect.",
    emoji: '😎',
  },
]

export default function SpecialAssessmentPage() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  // Fire confetti as soon as the page mounts
  useEffect(() => {
    const burst = () => {
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ff00ff', '#00ffff', '#ffff00', '#ff4500', '#7cfc00'],
        scalar: 1.3,
      })
    }
    burst()
    // Second burst for drama
    const t = setTimeout(burst, 400)
    return () => clearTimeout(t)
  }, [])

  const toggle = (id: string) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}
    >
      {/* Animated background orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-64 h-64 rounded-full opacity-30 blur-[80px]"
        style={{ background: 'radial-gradient(circle, #ff00ff, transparent)' }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #00ffff, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ffff00, transparent)' }} />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 shake inline-block">⚡</div>
          <h1
            className="font-headline text-4xl font-black mb-2"
            style={{
              background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SPECIAL ASSESSMENT
          </h1>
          <p className="text-purple-300 text-sm font-semibold tracking-widest uppercase">
            🚨 Classified Diagnostic Module 🚨
          </p>
        </div>

        {/* Question cards */}
        <div className="space-y-4">
          {QUESTIONS.map(({ id, text, roast, emoji }, i) => {
            const isChecked = !!checked[id]
            return (
              <div
                key={id}
                onClick={() => toggle(id)}
                role="checkbox"
                aria-checked={isChecked}
                aria-label={text}
                tabIndex={0}
                onKeyDown={e => e.key === ' ' && toggle(id)}
                className={`cursor-pointer rounded-xl p-5 border-2 transition-all duration-300 select-none
                  ${isChecked
                    ? 'border-pink-400 bg-pink-500/20 neon-pulse scale-[1.02]'
                    : 'border-purple-500/40 bg-white/5 hover:border-purple-400/70 hover:bg-white/10'
                  }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Custom glowing checkbox */}
                    <div
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
                        ${isChecked
                          ? 'bg-pink-500 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.8)]'
                          : 'border-purple-500/60 bg-transparent'
                        }`}
                    >
                      {isChecked && (
                        <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                    <span className="text-white font-semibold text-base">{text}</span>
                  </div>
                  <span className={`text-2xl transition-transform duration-300 ${isChecked ? 'scale-125' : ''}`}>
                    {isChecked ? emoji : '❓'}
                  </span>
                </div>

                {/* Roast message */}
                {isChecked && (
                  <div className="mt-3 ml-9 text-pink-300 text-sm font-medium italic animate-pulse">
                    {roast}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Total roast score */}
        {Object.values(checked).some(Boolean) && (
          <div
            className="mt-6 rounded-xl p-4 text-center border border-yellow-400/40 bg-yellow-400/10"
            style={{ boxShadow: '0 0 20px rgba(250,204,21,0.2)' }}
          >
            <p className="text-yellow-300 font-bold text-lg">
              Autism Score™: {Object.values(checked).filter(Boolean).length * 33}%
            </p>
            <p className="text-yellow-200/70 text-xs mt-1">
              (This number means absolutely nothing. We made it up.)
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-purple-400/60 text-xs mt-6 leading-relaxed">
          This section is entirely for entertainment purposes.<br />
          No data is collected, stored, or submitted. 🎉
        </p>

        {/* Back button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate('/screening')}
            aria-label="Return to screening"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm py-2 px-6 rounded-full border border-white/20 transition-all duration-200 active:scale-95 hover:scale-105 flex items-center gap-2"
          >
            ← Back to Screening
          </button>
        </div>
      </div>
    </div>
  )
}
