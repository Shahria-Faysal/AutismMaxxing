// src/components/Footer.tsx — Site-wide footer
export default function Footer() {
  return (
    <footer className="w-full mt-16 border-t border-[--color-outline-variant] bg-[--color-surface-container-low]">
      <div className="flex flex-col md:flex-row justify-between items-center py-8 px-4 md:px-6 max-w-[1140px] mx-auto text-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="text-sm font-semibold text-[--color-primary]">AutismMaxxing</span>
          <span className="text-xs text-[--color-secondary]">
            © 2024 AutismMaxxing. For informational purposes only. Not a clinical diagnosis.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-4">
          {['Privacy Policy', 'Terms of Service', 'Medical Disclaimer'].map(link => (
            <a
              key={link}
              href="#"
              className="text-xs text-[--color-on-surface-variant] hover:text-[--color-primary] transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
