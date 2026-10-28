import type { Project } from '../types/project'
import { resolveMediaUrl } from '../services/projectService'

/**
 * Convierte URLs normales de YouTube o Loom en sus versiones embebibles.
 */
export function getEmbedVideoUrl(url: string | null | undefined): {
  type: 'embed' | 'file'
  src: string
} | null {
  if (!url || !url.trim()) return null
  const clean = url.trim()

  // YouTube watch URL
  const ytWatchMatch = clean.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytWatchMatch) {
    return {
      type: 'embed',
      src: `https://www.youtube.com/embed/${ytWatchMatch[1]}`,
    }
  }

  // Loom share URL
  const loomMatch = clean.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return {
      type: 'embed',
      src: `https://www.loom.com/embed/${loomMatch[1]}`,
    }
  }

  // Archivo directo de video (.mp4, .webm, etc.)
  if (/\.(mp4|webm|ogg)$/i.test(clean)) {
    return {
      type: 'file',
      src: resolveMediaUrl(clean),
    }
  }

  // Por defecto si ya es embed o URL externa
  return {
    type: 'embed',
    src: clean,
  }
}

/**
 * Genera un SVG data-URI de placeholder elegante si el proyecto no tiene portada.
 */
export function getProjectCoverUrl(project: Partial<Project>): string {
  if (project.thumbnailUrl && project.thumbnailUrl.trim()) {
    return resolveMediaUrl(project.thumbnailUrl)
  }

  // Si hay alguna imagen en la galería, usa la primera
  if (project.images && project.images.length > 0 && project.images[0]?.trim()) {
    return resolveMediaUrl(project.images[0])
  }

  // Placeholder SVG inline minimalista tipo SaaS
  const title = (project.title || 'Proyecto').substring(0, 24)
  const category = project.category || 'WORK'
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='750' viewBox='0 0 1200 750'>
    <defs>
      <linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stop-color='#0f172a'/>
        <stop offset='50%' stop-color='#090d16'/>
        <stop offset='100%' stop-color='#020617'/>
      </linearGradient>
      <linearGradient id='acc' x1='0%' y1='0%' x2='100%' y2='0%'>
        <stop offset='0%' stop-color='#38bdf8'/>
        <stop offset='50%' stop-color='#22d3ee'/>
        <stop offset='100%' stop-color='#34d399'/>
      </linearGradient>
    </defs>
    <rect width='1200' height='750' fill='url(#bg)'/>
    <rect x='100' y='100' width='1000' height='550' rx='24' fill='#0b1329' stroke='#1e293b' stroke-width='2'/>
    <circle cx='150' cy='150' r='8' fill='#ef4444' opacity='0.7'/>
    <circle cx='180' cy='150' r='8' fill='#eab308' opacity='0.7'/>
    <circle cx='210' cy='150' r='8' fill='#22c55e' opacity='0.7'/>
    <rect x='150' y='210' width='420' height='28' rx='8' fill='url(#acc)' opacity='0.85'/>
    <rect x='150' y='265' width='650' height='16' rx='6' fill='#334155'/>
    <rect x='150' y='300' width='520' height='16' rx='6' fill='#334155' opacity='0.7'/>
    <rect x='150' y='360' width='260' height='180' rx='16' fill='#0f172a' stroke='#334155'/>
    <rect x='440' y='360' width='420' height='180' rx='16' fill='#0f172a' stroke='#334155'/>
    <text x='600' y='690' font-family='monospace' font-size='20' fill='#64748b' text-anchor='middle'>// ${category} — ${title}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Devuelve un mock de fallback de proyectos en caso de que el backend esté desconectado.
 */
export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'ClinicOps — Gestión de Turnos y Pacientes',
    shortDescription:
      'Sistema SaaS multi-sede para clínicas que gestiona turnos en tiempo real, historias clínicas y facturación con control de acceso por roles.',
    problemSolved:
      'Las clínicas gestionaban turnos en planillas y mensajería manual: doble reserva frecuente, ausentismo del 28% y nula trazabilidad de historias clínicas entre sedes.',
    architectureDetails:
      'Arquitectura desacoplada y escalable:\n- Frontend: SPA desarrollada en React y TypeScript con sincronización asíncrona.\n- Backend: API RESTful en Spring Boot 3 con Java 21 y seguridad stateless JWT.\n- Base de Datos: PostgreSQL 16 con esquema relacional normalizado y restricciones.',
    category: 'WORK',
    featured: true,
    technologies: ['React', 'TypeScript', 'Spring Boot', 'Java 21', 'PostgreSQL', 'Docker', 'JWT', 'Tailwind CSS'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=1200&auto=format&fit=crop&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    liveSystemUrl: 'https://clinicops-demo.example.com',
    demoEnvironmentUrl: 'https://clinicops-demo.example.com/tour',
    githubUrl: 'https://github.com/LucasAguilera05/clinic-ops',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'PayFlow API — Motor de Conciliación Bancaria',
    shortDescription:
      'API REST idempotente y de alto rendimiento que procesa y concilia transacciones financieras masivas con colas asíncronas y auditoría end-to-end.',
    problemSolved:
      'El sector financiero conciliaba extractos bancarios manualmente en planillas de cálculo, demorando más de 72 horas por cierre contable y generando inconsistencias por registros duplicados.',
    architectureDetails:
      'Arquitectura orientada a eventos e idempotencia:\n- Backend: API en Spring Boot 3 con procesamiento concurrente, transaccionalidad declarativa y Redis.\n- Base de Datos: PostgreSQL particionado con índices B-Tree compuestos.\n- Mensajería & Cache: RabbitMQ para desacoplamiento y Redis para control de concurrencia.',
    category: 'WORK',
    featured: true,
    technologies: ['Java 21', 'Spring Boot', 'PostgreSQL', 'RabbitMQ', 'Redis', 'Docker', 'Spring Data JPA'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    liveSystemUrl: 'https://payflow-api.example.com',
    demoEnvironmentUrl: 'https://payflow-api.example.com/swagger-ui.html',
    githubUrl: 'https://github.com/LucasAguilera05/payflow-api',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
