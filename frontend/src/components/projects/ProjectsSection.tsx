import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import type { Project, ProjectCategory } from '../../types/project'
import { CATEGORIES, CATEGORY_LABELS } from '../../types/project'
import { getPublicProjects } from '../../services/projectService'
import { FALLBACK_PROJECTS } from '../../utils/projectAdapter'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

type Filter = ProjectCategory | 'all'
const FILTERS: Filter[] = ['all', ...CATEGORIES]

function ProjectSkeleton() {
  return (
    <div className="surface flex flex-col overflow-hidden animate-pulse border-slate-800">
      <div className="aspect-16/10 w-full bg-slate-800/60" />
      <div className="flex flex-1 flex-col p-5 space-y-3">
        <div className="h-3 w-24 rounded bg-slate-800" />
        <div className="h-5 w-3/4 rounded bg-slate-800" />
        <div className="space-y-2 py-1">
          <div className="h-3.5 w-full rounded bg-slate-800/80" />
          <div className="h-3.5 w-5/6 rounded bg-slate-800/80" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 rounded-md bg-slate-800/60" />
          <div className="h-6 w-20 rounded-md bg-slate-800/60" />
          <div className="h-6 w-14 rounded-md bg-slate-800/60" />
        </div>
        <div className="h-10 w-full rounded-xl bg-slate-800/40 mt-4" />
      </div>
    </div>
  )
}

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('all')
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Project | null>(null)

  const loadProjects = useCallback(async (currentFilter: Filter) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getPublicProjects(currentFilter === 'all' ? undefined : currentFilter)
      setProjectsList(data)
    } catch (err) {
      console.warn('No se pudo conectar a la API REST de proyectos, usando datos locales:', err)
      setError('No se pudo conectar con el backend en tiempo real. Mostrando proyectos en modo demostración.')
      // Fallback a proyectos iniciales
      const filteredFallback =
        currentFilter === 'all'
          ? FALLBACK_PROJECTS
          : FALLBACK_PROJECTS.filter((p) => p.category === currentFilter)
      setProjectsList(filteredFallback)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects(filter)
  }, [filter, loadProjects])

  const close = useCallback(() => setSelected(null), [])

  return (
    <section id="proyectos" className="relative py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="tag-mono text-cyan-300">// 01 — proyectos</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Sistemas que resuelven problemas reales
            </h2>
            <p className="mt-3 max-w-2xl text-slate-400">
              Casos de estudio conectados a la API REST en Spring Boot, con métricas, arquitectura y código fuente.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadProjects(filter)}
            disabled={loading}
            aria-label="Recargar proyectos desde la API"
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white hover:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-cyan-400' : ''} />
            Sincronizar
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
            <AlertCircle size={18} className="shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p>{error}</p>
            </div>
            <button
              type="button"
              onClick={() => loadProjects(filter)}
              className="tag-mono underline hover:text-white cursor-pointer"
            >
              Reintentar
            </button>
          </div>
        )}

        <div role="group" aria-label="Filtrar proyectos por categoría" className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.97] cursor-pointer ${
                filter === f
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200 shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        ) : (
          <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {projectsList.map((p) => (
                <ProjectCard key={p.id} project={p} onOpen={setSelected} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && projectsList.length === 0 && (
          <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/40 p-12 text-center">
            <p className="text-slate-400 text-lg">No hay proyectos en esta categoría todavía.</p>
            <p className="text-slate-600 text-sm mt-1">Crea tu primer proyecto desde el Panel de Administración.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal key={selected.id} project={selected} onClose={close} />}
      </AnimatePresence>
    </section>
  )
}
