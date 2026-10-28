import { motion } from 'framer-motion'
import { ArrowUpRight, PlayCircle, Radio, Sparkles } from 'lucide-react'
import type { Project } from '../../types/project'
import { CATEGORY_LABELS } from '../../types/project'
import { TechBadge } from '../ui/TechBadge'
import { getProjectCoverUrl } from '../../utils/projectAdapter'

interface ProjectCardProps {
  project: Project
  onOpen?: (project: Project) => void
  isLivePreview?: boolean
}

export function ProjectCard({ project, onOpen, isLivePreview = false }: ProjectCardProps) {
  const hasVideo = Boolean(project.videoUrl && project.videoUrl.trim())
  const hasLive = Boolean(project.liveSystemUrl && project.liveSystemUrl.trim())
  const coverUrl = getProjectCoverUrl(project)
  const categoryLabel = CATEGORY_LABELS[project.category] || project.category

  const handleOpen = () => {
    if (onOpen) onOpen(project)
  }

  return (
    <motion.article
      layout={!isLivePreview}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35 }}
      className={`group surface flex flex-col overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-500/5 ${
        project.featured ? 'border-cyan-500/30 ring-1 ring-cyan-500/10' : ''
      }`}
    >
      <button
        type="button"
        onClick={handleOpen}
        disabled={isLivePreview}
        aria-label={`Ver caso de estudio: ${project.title || 'Proyecto'}`}
        className={`relative block aspect-16/10 w-full overflow-hidden text-left ${
          isLivePreview ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <img
          src={coverUrl}
          alt={`Captura de ${project.title || 'Proyecto'}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {project.featured && (
            <span className="tag-mono inline-flex items-center gap-1 rounded-md border border-cyan-400/40 bg-cyan-950/80 px-2 py-1 text-cyan-200 backdrop-blur-md shadow-sm">
              <Sparkles size={12} className="text-cyan-300" aria-hidden="true" /> Destacado
            </span>
          )}
          {hasVideo && (
            <span className="tag-mono inline-flex items-center gap-1.5 rounded-md border border-slate-700/80 bg-slate-950/80 px-2 py-1 text-slate-200 backdrop-blur-md">
              <PlayCircle size={13} className="text-cyan-300" aria-hidden="true" /> Video Demo
            </span>
          )}
          {hasLive && (
            <span className="tag-mono inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-slate-950/80 px-2 py-1 text-emerald-300 backdrop-blur-md">
              <Radio size={13} aria-hidden="true" /> En Vivo
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="tag-mono text-cyan-400/80">{categoryLabel}</span>
          {project.updatedAt && (
            <span className="tag-mono text-slate-600 text-[10px]">
              {new Date(project.updatedAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        <h3 className="mt-1.5 text-lg leading-snug font-semibold text-white">
          {project.title || 'Título del proyecto'}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-3">
          {project.shortDescription || 'Descripción corta del proyecto para la tarjeta...'}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologías">
            {project.technologies.slice(0, 5).map((t) => (
              <li key={t}>
                <TechBadge name={t} />
              </li>
            ))}
            {project.technologies.length > 5 && (
              <li className="tag-mono flex items-center px-1.5 text-slate-500 text-xs">
                +{project.technologies.length - 5}
              </li>
            )}
          </ul>
        )}

        <button
          type="button"
          onClick={handleOpen}
          disabled={isLivePreview}
          className={`mt-5 inline-flex items-center justify-between rounded-xl border border-slate-700/80 bg-slate-950/40 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 ${
            isLivePreview
              ? 'opacity-70 cursor-default'
              : 'hover:border-cyan-400/40 hover:bg-slate-800/60 active:scale-[0.99] cursor-pointer'
          }`}
        >
          Ver Caso de Estudio
          <ArrowUpRight
            size={16}
            className="text-slate-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-300"
            aria-hidden="true"
          />
        </button>
      </div>
    </motion.article>
  )
}
