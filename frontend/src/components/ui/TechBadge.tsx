import type { TechName } from '../../data/projects'

const TECH_STYLES: Partial<Record<TechName, string>> = {
  React: 'text-cyan-300 border-cyan-400/25 bg-cyan-400/10',
  TypeScript: 'text-sky-300 border-sky-400/25 bg-sky-400/10',
  'Spring Boot': 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10',
  Java: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10',
  PostgreSQL: 'text-blue-300 border-blue-400/25 bg-blue-400/10',
}

const DEFAULT_STYLE = 'text-slate-300 border-slate-700 bg-slate-800/50'

interface TechBadgeProps {
  name: string
  className?: string
}

export function TechBadge({ name, className = '' }: TechBadgeProps) {
  const style = TECH_STYLES[name as TechName] ?? DEFAULT_STYLE
  return (
    <span className={`tag-mono inline-flex items-center rounded-md border px-2 py-1 ${style} ${className}`}>
      {name}
    </span>
  )
}
