import { motion } from 'framer-motion'
import { Database, Layout, Server, type LucideIcon } from 'lucide-react'

interface StackLayer {
  icon: LucideIcon
  label: string
  title: string
  items: string[]
  color: string
  glow: string
}

const LAYERS: StackLayer[] = [
  {
    icon: Layout,
    label: 'FRONTEND',
    title: 'React + TypeScript',
    items: ['SPA modulares', 'React Query', 'Framer Motion'],
    color: 'text-cyan-300 bg-cyan-400/10 border-cyan-400/25',
    glow: 'group-hover:border-cyan-400/40 group-hover:shadow-cyan-500/10',
  },
  {
    icon: Server,
    label: 'BACKEND',
    title: 'Spring Boot · REST / Microservicios',
    items: ['Arquitectura hexagonal', 'Spring Security + JWT', 'Mensajería asíncrona'],
    color: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/25',
    glow: 'group-hover:border-emerald-400/40 group-hover:shadow-emerald-500/10',
  },
  {
    icon: Database,
    label: 'DATABASE',
    title: 'PostgreSQL · Modelado Relacional',
    items: ['Índices & particiones', 'Migraciones Flyway', 'Integridad transaccional'],
    color: 'text-blue-300 bg-blue-400/10 border-blue-400/25',
    glow: 'group-hover:border-blue-400/40 group-hover:shadow-blue-500/10',
  },
]

export function StackBentoCard() {
  return (
    <motion.aside
      id="arquitectura"
      aria-label="Resumen del stack principal"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="surface relative p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        </div>
        <span className="tag-mono text-slate-500">architecture.yml</span>
      </div>

      <ul className="flex flex-col gap-3">
        {LAYERS.map((l, i) => (
          <motion.li
            key={l.label}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.12 }}
            whileHover={{ x: 4 }}
            className={`group rounded-xl border border-slate-800/80 bg-slate-950/50 p-4 shadow-lg shadow-transparent transition-[border-color,box-shadow] duration-300 ${l.glow}`}
          >
            <div className="flex items-start gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${l.color}`}>
                <l.icon size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="tag-mono text-slate-500">{l.label}</p>
                <h3 className="text-sm font-semibold text-white">{l.title}</h3>
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {l.items.map((it) => (
                    <li key={it} className="tag-mono text-slate-400">
                      <span className="text-slate-600">› </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 px-3 py-2">
        <span className="tag-mono text-slate-500">status</span>
        <span className="tag-mono flex items-center gap-2 text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          disponible para nuevos desafíos
        </span>
      </div>
    </motion.aside>
  )
}
