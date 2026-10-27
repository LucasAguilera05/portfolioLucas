import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, FileCode2, Lightbulb, PlayCircle, X } from 'lucide-react'
import type { Project } from '../../data/projects'
import { GithubIcon } from '../ui/BrandIcons'
import { TechBadge } from '../ui/TechBadge'
import { MediaViewer } from './MediaViewer'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

const LAYER_COLORS: Record<string, string> = {
  Frontend: 'border-cyan-400/30 text-cyan-300',
  Backend: 'border-emerald-400/30 text-emerald-300',
  Database: 'border-blue-400/30 text-blue-300',
  Infra: 'border-slate-600 text-slate-300',
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus()
    }
  }, [onClose])

  const { links } = project

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-slate-700/80 bg-slate-900 shadow-2xl shadow-black/60 outline-none sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4 sm:px-8">
          <div>
            <p className="tag-mono text-slate-500">{project.tagline}</p>
            <h2 id="modal-title" className="mt-1 text-xl font-bold text-white sm:text-2xl">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar caso de estudio"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-800 text-slate-400 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-8 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <MediaViewer project={project} />

          <dl className="grid grid-cols-3 gap-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-center">
                <dd className="text-xl font-bold text-gradient sm:text-2xl">{m.value}</dd>
                <dt className="tag-mono mt-1 text-slate-500">{m.label}</dt>
              </div>
            ))}
          </dl>

          <section aria-labelledby="problem-title" className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <h3 id="problem-title" className="flex items-center gap-2 text-sm font-semibold text-white">
                <AlertTriangle size={16} className="text-amber-300" aria-hidden="true" /> Problema de Negocio
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{project.problem}</p>
            </div>
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Lightbulb size={16} className="text-emerald-300" aria-hidden="true" /> Solución
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{project.solution}</p>
            </div>
          </section>

          <section aria-labelledby="arch-title">
            <h3 id="arch-title" className="text-sm font-semibold text-white">
              Arquitectura Técnica
            </h3>
            <ol className="mt-4 space-y-3 border-l border-slate-800 pl-5">
              {project.architecture.map((a) => (
                <li key={a.layer} className="relative">
                  <span className="absolute top-2 -left-[25px] h-2 w-2 rounded-full bg-slate-600" aria-hidden="true" />
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`tag-mono rounded-md border px-2 py-0.5 ${LAYER_COLORS[a.layer]}`}>{a.layer}</span>
                      <span className="tag-mono text-slate-400">{a.stack}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{a.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologías">
            {project.technologies.map((t) => (
              <li key={t}>
                <TechBadge name={t} />
              </li>
            ))}
          </ul>
        </div>

        <footer className="flex flex-wrap gap-3 border-t border-slate-800 bg-slate-900/95 px-5 py-4 sm:px-8">
          {links.live && (
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-[filter] duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <ExternalLink size={15} aria-hidden="true" /> Abrir Sistema en Vivo
            </a>
          )}
          {links.demo && (
            <a
              href={links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800 active:scale-[0.98]"
            >
              <PlayCircle size={15} aria-hidden="true" /> Ver Demo
            </a>
          )}
          {links.repo && (
            <a
              href={links.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800 active:scale-[0.98]"
            >
              <GithubIcon className="h-4 w-4" />
              Repositorio
              <FileCode2 size={15} className="text-slate-400" aria-hidden="true" />
              Docs
            </a>
          )}
        </footer>
      </motion.div>
    </motion.div>
  )
}
