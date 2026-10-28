import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ExternalLink, FileCode2, Layers, PlayCircle, Sparkles, X } from 'lucide-react'
import type { Project } from '../../types/project'
import { CATEGORY_LABELS } from '../../types/project'
import { GithubIcon } from '../ui/BrandIcons'
import { TechBadge } from '../ui/TechBadge'
import { MediaViewer } from './MediaViewer'

interface ProjectModalProps {
  project: Project
  onClose: () => void
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

  const categoryLabel = CATEGORY_LABELS[project.category] || project.category

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

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
            <div className="flex items-center gap-2">
              <span className="tag-mono text-cyan-400">{categoryLabel}</span>
              {project.featured && (
                <span className="tag-mono inline-flex items-center gap-1 rounded-md border border-cyan-400/40 bg-cyan-950/80 px-2 py-0.5 text-cyan-200">
                  <Sparkles size={11} className="text-cyan-300" aria-hidden="true" /> Destacado
                </span>
              )}
            </div>
            <h2 id="modal-title" className="mt-1 text-xl font-bold text-white sm:text-2xl">
              {project.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar caso de estudio"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-800 text-slate-400 transition-colors duration-200 hover:bg-slate-800 hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-8 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          <MediaViewer project={project} />

          {/* Resumen / Descripción corta */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
            <h3 className="tag-mono text-slate-400 uppercase">// Resumen Ejecutivo</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-200">{project.shortDescription}</p>
          </div>

          {/* Problema Resuelto */}
          {project.problemSolved && (
            <section aria-labelledby="problem-title" className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
              <h3 id="problem-title" className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                <AlertTriangle size={16} className="text-amber-400" aria-hidden="true" /> Problema de Negocio Resuelto
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                {project.problemSolved}
              </p>
            </section>
          )}

          {/* Detalles de Arquitectura */}
          {project.architectureDetails && (
            <section aria-labelledby="arch-title" className="rounded-2xl border border-cyan-500/20 bg-slate-950/50 p-5">
              <h3 id="arch-title" className="flex items-center gap-2 text-sm font-semibold text-cyan-200">
                <Layers size={16} className="text-cyan-400" aria-hidden="true" /> Arquitectura y Decisiones Técnicas
              </h3>
              <div className="mt-3 text-sm leading-relaxed text-slate-300 whitespace-pre-line font-sans">
                {project.architectureDetails}
              </div>
            </section>
          )}

          {/* Tecnologías */}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="tag-mono text-slate-400 uppercase">// Tecnologías & Herramientas</h3>
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tecnologías utilizadas">
                {project.technologies.map((t) => (
                  <li key={t}>
                    <TechBadge name={t} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap gap-3 border-t border-slate-800 bg-slate-900/95 px-5 py-4 sm:px-8">
          {project.liveSystemUrl && (
            <a
              href={project.liveSystemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-emerald-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-[filter] duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <ExternalLink size={15} aria-hidden="true" /> Abrir Sistema en Vivo
            </a>
          )}
          {project.demoEnvironmentUrl && (
            <a
              href={project.demoEnvironmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition-colors duration-200 hover:bg-cyan-900/50 active:scale-[0.98]"
            >
              <PlayCircle size={15} className="text-cyan-300" aria-hidden="true" /> Entorno Demo / Swagger
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800 active:scale-[0.98]"
            >
              <GithubIcon className="h-4 w-4" />
              Código en GitHub
              <FileCode2 size={15} className="text-slate-400" aria-hidden="true" />
            </a>
          )}
        </footer>
      </motion.div>
    </motion.div>
  )
}
