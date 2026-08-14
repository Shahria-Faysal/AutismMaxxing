// src/components/Header.tsx — Sticky top navigation bar
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  return (
    <header className="w-full sticky top-0 z-50 bg-[--color-surface] shadow-[0_4px_20px_rgba(90,155,181,0.08)]">
      <div className="flex items-center justify-between px-4 md:px-6 max-w-[1140px] mx-auto h-16">
        {/* Logo / brand */}
        <button
          onClick={() => navigate('/')}
          aria-label="Go to home"
          className="flex items-center gap-2 cursor-pointer active:scale-95 text-[--color-primary] bg-transparent border-none"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
          <span className="font-headline font-bold text-2xl">AutismMaxxing</span>
        </button>

        {/* Nav */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate('/screening')}
              className="text-sm font-semibold text-[--color-on-surface-variant] hover:text-[--color-primary] transition-colors bg-transparent border-none cursor-pointer"
            >
              Screening
            </button>
          </nav>
          <button
            aria-label="Help"
            className="cursor-pointer text-[--color-on-surface-variant] hover:bg-[--color-surface-container-high] transition-colors rounded-full p-2 bg-transparent border-none"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
              help
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}
