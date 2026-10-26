export type ProjectCategory = 'production' | 'backend' | 'academic'

export type TechName =
  | 'React'
  | 'TypeScript'
  | 'Spring Boot'
  | 'Java'
  | 'PostgreSQL'
  | 'Docker'
  | 'Redis'
  | 'JWT'
  | 'Tailwind CSS'
  | 'RabbitMQ'
  | 'Flyway'

export interface ProjectVideo {
  type: 'youtube' | 'loom' | 'file'
  /** Embed URL (youtube/loom) o ruta al archivo de video (file) */
  url: string
  poster?: string
}

export interface ProjectLinks {
  live?: string
  demo?: string
  repo?: string
}

export interface ArchitectureLayer {
  layer: 'Frontend' | 'Backend' | 'Database' | 'Infra'
  stack: string
  description: string
}

export interface ProjectMetric {
  label: string
  value: string
}

export interface Project {
  id: string
  title: string
  tagline: string
  category: ProjectCategory
  cover: string
  screenshots: string[]
  technologies: TechName[]
  shortDescription: string
  video?: ProjectVideo
  links: ProjectLinks
  problem: string
  solution: string
  architecture: ArchitectureLayer[]
  metrics: ProjectMetric[]
}

export const CATEGORY_LABELS: Record<ProjectCategory | 'all', string> = {
  all: 'Todos',
  production: 'Sistemas en Producción',
  backend: 'Backend & APIs',
  academic: 'Académicos/Ingeniería',
}

/**
 * Imágenes generadas con gradientes SVG inline (data URI) para que el proyecto
 * funcione sin assets externos. Reemplazar por capturas reales en /public.
 */
const mock = (from: string, to: string, label: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1280' height='800' viewBox='0 0 1280 800'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/>
        </linearGradient>
      </defs>
      <rect width='1280' height='800' fill='#0b1120'/>
      <rect width='1280' height='800' fill='url(#g)' opacity='0.28'/>
      <rect x='80' y='80' width='1120' height='56' rx='14' fill='#0f172a' stroke='#1e293b'/>
      <circle cx='116' cy='108' r='8' fill='#334155'/><circle cx='144' cy='108' r='8' fill='#334155'/><circle cx='172' cy='108' r='8' fill='#334155'/>
      <rect x='80' y='168' width='260' height='552' rx='14' fill='#0f172a' stroke='#1e293b'/>
      <rect x='368' y='168' width='832' height='160' rx='14' fill='#0f172a' stroke='#1e293b'/>
      <rect x='368' y='352' width='400' height='368' rx='14' fill='#0f172a' stroke='#1e293b'/>
      <rect x='792' y='352' width='408' height='368' rx='14' fill='#0f172a' stroke='#1e293b'/>
      <rect x='400' y='200' width='320' height='20' rx='6' fill='${from}' opacity='0.8'/>
      <rect x='400' y='240' width='520' height='12' rx='6' fill='#334155'/>
      <rect x='400' y='268' width='440' height='12' rx='6' fill='#334155'/>
      <text x='640' y='770' font-family='monospace' font-size='22' fill='#64748b' text-anchor='middle'>${label}</text>
    </svg>`,
  )}`

export const projects: Project[] = [
  {
    id: 'clinic-ops',
    title: 'ClinicOps — Gestión de Turnos y Pacientes',
    tagline: 'Plataforma SaaS multi-sede para clínicas',
    category: 'production',
    cover: mock('#22d3ee', '#3b82f6', 'ClinicOps / dashboard'),
    screenshots: [
      mock('#22d3ee', '#3b82f6', 'ClinicOps / dashboard'),
      mock('#38bdf8', '#34d399', 'ClinicOps / agenda'),
      mock('#3b82f6', '#6366f1', 'ClinicOps / historia clínica'),
    ],
    technologies: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Docker', 'JWT'],
    shortDescription:
      'Sistema en producción que gestiona turnos, historias clínicas y facturación para 12 sedes, con control de acceso por roles.',
    video: { type: 'youtube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    links: {
      live: 'https://example.com/clinicops',
      demo: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      repo: 'https://github.com/tu-usuario/clinic-ops',
    },
    problem:
      'Las clínicas gestionaban turnos en planillas y WhatsApp: doble reserva, ausentismo del 28% y cero trazabilidad de historias clínicas entre sedes.',
    solution:
      'Un SaaS multi-tenant con agenda en tiempo real, recordatorios automáticos y auditoría completa. Redujo el ausentismo al 11% y eliminó las dobles reservas mediante bloqueo optimista en base de datos.',
    architecture: [
      {
        layer: 'Frontend',
        stack: 'React + TypeScript + React Query',
        description:
          'SPA con code-splitting por módulo. React Query cachea la agenda y sincroniza con polling inteligente; formularios tipados con Zod.',
      },
      {
        layer: 'Backend',
        stack: 'Spring Boot 3 · Spring Security · JWT',
        description:
          'API REST en arquitectura hexagonal (puertos y adaptadores). Autenticación stateless con JWT y autorización por rol/sede vía @PreAuthorize.',
      },
      {
        layer: 'Database',
        stack: 'PostgreSQL 16 · Flyway',
        description:
          'Esquema relacional normalizado con índices parciales, restricciones EXCLUDE para evitar solapamiento de turnos y migraciones versionadas.',
      },
      {
        layer: 'Infra',
        stack: 'Docker Compose · GitHub Actions',
        description: 'CI/CD con tests de integración usando Testcontainers y despliegue contenedorizado.',
      },
    ],
    metrics: [
      { label: 'Sedes', value: '12' },
      { label: 'Turnos / mes', value: '18k+' },
      { label: 'Ausentismo', value: '-60%' },
    ],
  },
  {
    id: 'payflow-api',
    title: 'PayFlow API — Motor de Conciliación',
    tagline: 'API de pagos y conciliación bancaria',
    category: 'backend',
    cover: mock('#34d399', '#0ea5e9', 'PayFlow / swagger'),
    screenshots: [
      mock('#34d399', '#0ea5e9', 'PayFlow / swagger'),
      mock('#10b981', '#22d3ee', 'PayFlow / métricas'),
    ],
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'RabbitMQ', 'Redis', 'Docker'],
    shortDescription:
      'API REST idempotente que procesa y concilia transacciones con colas asíncronas, reintentos y trazabilidad end-to-end.',
    links: {
      demo: 'https://example.com/payflow/swagger-ui',
      repo: 'https://github.com/tu-usuario/payflow-api',
    },
    problem:
      'El área financiera conciliaba extractos bancarios manualmente en Excel, demorando 3 días por cierre y con errores por duplicados.',
    solution:
      'Un servicio de ingesta con claves de idempotencia, procesamiento por lotes asíncrono y reglas de conciliación configurables. El cierre pasó de 3 días a 20 minutos.',
    architecture: [
      {
        layer: 'Frontend',
        stack: 'React + Tailwind CSS',
        description: 'Panel de conciliación con tablas virtualizadas para cargas de +100k filas y filtros persistentes en URL.',
      },
      {
        layer: 'Backend',
        stack: 'Spring Boot · Spring Batch · RabbitMQ',
        description:
          'Productores publican eventos de transacción; consumidores concilian en paralelo con reintentos exponenciales y dead-letter queues.',
      },
      {
        layer: 'Database',
        stack: 'PostgreSQL · Redis',
        description:
          'Tablas particionadas por mes, índices compuestos para matching y Redis para claves de idempotencia con TTL.',
      },
    ],
    metrics: [
      { label: 'Tx / min', value: '5k' },
      { label: 'Cierre', value: '20 min' },
      { label: 'Cobertura', value: '82%' },
    ],
  },
  {
    id: 'campus-scheduler',
    title: 'Campus Scheduler — Optimizador de Horarios',
    tagline: 'Proyecto académico de investigación operativa',
    category: 'academic',
    cover: mock('#6366f1', '#22d3ee', 'Scheduler / grilla'),
    screenshots: [
      mock('#6366f1', '#22d3ee', 'Scheduler / grilla'),
      mock('#8b5cf6', '#38bdf8', 'Scheduler / conflictos'),
    ],
    technologies: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL'],
    shortDescription:
      'Generador de horarios universitarios con algoritmo de satisfacción de restricciones y visualización interactiva de conflictos.',
    video: { type: 'loom', url: 'https://www.loom.com/embed/your-video-id' },
    links: {
      demo: 'https://www.loom.com/share/your-video-id',
      repo: 'https://github.com/tu-usuario/campus-scheduler',
    },
    problem:
      'Armar horarios de cátedras, aulas y docentes sin solapamientos es un problema NP-difícil que en la facultad se resolvía a mano cada cuatrimestre.',
    solution:
      'Modelado como CSP con backtracking y heurísticas (MRV, forward checking) que genera propuestas en segundos, con editor drag & drop para ajustes manuales.',
    architecture: [
      {
        layer: 'Frontend',
        stack: 'React + TypeScript',
        description: 'Grilla semanal con drag & drop y resaltado en tiempo real de restricciones violadas.',
      },
      {
        layer: 'Backend',
        stack: 'Spring Boot · Java 21',
        description: 'Motor CSP desacoplado del dominio, expuesto vía endpoints REST con ejecución asíncrona.',
      },
      {
        layer: 'Database',
        stack: 'PostgreSQL',
        description: 'Modelo relacional de cátedras, aulas, docentes y disponibilidades con restricciones de integridad.',
      },
    ],
    metrics: [
      { label: 'Cátedras', value: '240' },
      { label: 'Generación', value: '< 8 s' },
      { label: 'Conflictos', value: '0' },
    ],
  },
]
