/** Categorías tal como las define el enum `ProjectCategory` del backend. */
export type ProjectCategory = 'WORK' | 'FREELANCE' | 'ACADEMIC' | 'PERSONAL'

export const CATEGORIES: readonly ProjectCategory[] = ['WORK', 'FREELANCE', 'ACADEMIC', 'PERSONAL']

export const CATEGORY_LABELS: Record<ProjectCategory | 'all', string> = {
  all: 'Todos',
  WORK: 'Sistemas en Producción',
  FREELANCE: 'Freelance',
  ACADEMIC: 'Académicos / Ingeniería',
  PERSONAL: 'Proyectos Personales',
}

/** Respuesta de `GET /projects` y `GET /projects/:id` (ProjectResponseDto). */
export interface Project {
  id: number
  title: string
  shortDescription: string
  problemSolved: string | null
  architectureDetails: string | null
  category: ProjectCategory
  featured: boolean
  technologies: string[]
  thumbnailUrl: string | null
  images: string[]
  videoUrl: string | null
  liveSystemUrl: string | null
  demoEnvironmentUrl: string | null
  githubUrl: string | null
  createdAt: string
  updatedAt: string
}

/** Cuerpo de `POST/PUT /admin/projects` (ProjectRequestDto). */
export interface ProjectInput {
  title: string
  shortDescription: string
  problemSolved: string
  architectureDetails: string
  category: ProjectCategory
  featured: boolean
  technologies: string[]
  thumbnailUrl: string
  images: string[]
  videoUrl: string
  liveSystemUrl: string
  demoEnvironmentUrl: string
  githubUrl: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  expiresInMs: number
  username: string
}

export interface UploadResponse {
  url: string
  filename: string
  contentType: string
  sizeBytes: number
}

/** Cuerpo de error estándar del backend (ApiErrorResponse). */
export interface ApiErrorBody {
  status: number
  error?: string
  message?: string
  validationErrors?: Record<string, string>
}
