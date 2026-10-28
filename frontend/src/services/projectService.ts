import type {
  ApiErrorBody,
  AuthResponse,
  Project,
  ProjectCategory,
  ProjectInput,
  UploadResponse,
} from '../types/project'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api/v1'
const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '')

const TOKEN_KEY = 'portfolio_admin_jwt'
const USER_KEY = 'portfolio_admin_user'

export class ApiError extends Error {
  status: number
  body?: ApiErrorBody
  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/**
 * Convierte rutas relativas generadas por el backend (ej: /uploads/abc.png)
 * en URLs absolutas accesibles desde el frontend.
 */
export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url
  }
  if (url.startsWith('/')) {
    return `${API_ORIGIN}${url}`
  }
  return `${API_ORIGIN}/${url}`
}

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function getStoredUser(): string | null {
  try {
    return localStorage.getItem(USER_KEY)
  } catch {
    return null
  }
}

export function saveAuthSession(auth: AuthResponse): void {
  try {
    localStorage.setItem(TOKEN_KEY, auth.token)
    localStorage.setItem(USER_KEY, auth.username)
  } catch {
    // LocalStorage deshabilitado o privado
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {
    // Ignorar errores al limpiar
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken())
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorBody: ApiErrorBody | undefined
    try {
      errorBody = await res.json()
    } catch {
      // no es JSON
    }
    const message =
      errorBody?.message ||
      (errorBody?.validationErrors
        ? Object.values(errorBody.validationErrors).join(', ')
        : `Error HTTP ${res.status}: ${res.statusText}`)

    if (res.status === 401 || res.status === 403) {
      // Token expirado o inválido
      clearAuthSession()
    }

    throw new ApiError(res.status, message, errorBody)
  }

  // Si el response es 204 No Content
  if (res.status === 204) {
    return null as unknown as T
  }

  return res.json()
}

/**
 * Petición pública GET /api/v1/projects
 */
export async function getPublicProjects(category?: ProjectCategory | 'all'): Promise<Project[]> {
  const url = new URL(`${API_BASE}/projects`)
  if (category && category !== 'all') {
    url.searchParams.set('category', category)
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  return handleResponse<Project[]>(res)
}

/**
 * Petición pública GET /api/v1/projects/:id
 */
export async function getPublicProjectById(id: number | string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  return handleResponse<Project>(res)
}

/**
 * Login de Administrador POST /api/v1/auth/login
 */
export async function adminLogin(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  const authData = await handleResponse<AuthResponse>(res)
  saveAuthSession(authData)
  return authData
}

/**
 * Helper con headers de autorización
 */
function authHeaders(): HeadersInit {
  const token = getStoredToken()
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

/**
 * Crear Proyecto POST /api/v1/admin/projects
 */
export async function createAdminProject(data: ProjectInput): Promise<Project> {
  const res = await fetch(`${API_BASE}/admin/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<Project>(res)
}

/**
 * Editar Proyecto PUT /api/v1/admin/projects/:id
 */
export async function updateAdminProject(id: number | string, data: ProjectInput): Promise<Project> {
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  return handleResponse<Project>(res)
}

/**
 * Eliminar Proyecto DELETE /api/v1/admin/projects/:id
 */
export async function deleteAdminProject(id: number | string): Promise<void> {
  const token = getStoredToken()
  const res = await fetch(`${API_BASE}/admin/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  await handleResponse<void>(res)
}

/**
 * Subir archivo multimedia POST /api/v1/admin/media/upload
 */
export async function uploadMedia(file: File): Promise<UploadResponse> {
  const token = getStoredToken()
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/admin/media/upload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  return handleResponse<UploadResponse>(res)
}
