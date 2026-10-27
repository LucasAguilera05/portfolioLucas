import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Arquitectura & Stack', href: '#arquitectura' },
  { label: 'Contacto', href: '#contacto' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-4 top-4 z-50 flex justify-center">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        aria-label="Navegación principal"
        className={`w-full max-w-4xl rounded-2xl border backdrop-blur-xl transition-colors duration-300 ${
          scrolled ? 'border-slate-700/80 bg-slate-900/80 shadow-2xl shadow-black/40' : 'border-slate-800/80 bg-slate-900/50'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <a href="#inicio" className="tag-mono flex items-center gap-2 text-sm font-semibold text-white">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-linear-to-br from-sky-400 to-emerald-400 text-slate-950">
              &lt;/&gt;
            </span>
            <span className="hidden sm:inline">dev.portfolio</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors duration-200 hover:bg-slate-800/70 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-950 transition-colors duration-200 hover:bg-cyan-200 active:scale-[0.98]"
            >
              <Download size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Descargar CV</span>
              <span className="sm:hidden">CV</span>
            </a>
            <button
              type="button"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-800 text-slate-300 transition-colors hover:bg-slate-800 md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-800/80 px-2 md:hidden"
            >
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-sm text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
