import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORY_LABELS, projects, type Project, type ProjectCategory } from '../../data/projects'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

type Filter = ProjectCategory | 'all'
const FILTERS = Object.keys(CATEGORY_LABELS) as Filter[]

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )
  const close = useCallback(() => setSelected(null), [])

  return (
    <section id="proyectos" className="relative py-20 sm:py-28">
      <div className="container-page">
        <p className="tag-mono text-cyan-300">// 01 — proyectos</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Sistemas que resuelven problemas reales</h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Casos de estudio con el problema de negocio, la solución y la arquitectura detrás de cada sistema.
        </p>

        <div role="group" aria-label="Filtrar proyectos por categoría" className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 active:scale-[0.97] ${
                filter === f
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan-200'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-white'
              }`}
            >
              {CATEGORY_LABELS[f]}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={setSelected} />
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 && <p className="mt-10 text-slate-500">No hay proyectos en esta categoría todavía.</p>}
      </div>

      <AnimatePresence>{selected && <ProjectModal key={selected.id} project={selected} onClose={close} />}</AnimatePresence>
    </section>
  )
}
