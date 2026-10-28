import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Eye, EyeOff, Lock, LogIn, Shield, User } from 'lucide-react'
import { adminLogin, isAuthenticated } from '../../services/projectService'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('lucas')
  const [password, setPassword] = useState('lucas')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Si ya tiene sesión activa, redirigir directo al dashboard
  if (isAuthenticated()) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Por favor ingresa usuario y contraseña.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await adminLogin(username.trim(), password.trim())
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard'
      navigate(from, { replace: true })
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Credenciales inválidas o servidor no disponible.')
      } else {
        setError('Error inesperado al intentar iniciar sesión.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 selection:bg-cyan-500/30">
      {/* Background ambient glow & grid */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Botón Volver al Portfolio */}
      <div className="relative mb-8 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 tag-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Volver al portfolio principal
        </Link>
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-500/30 bg-cyan-950/50 text-cyan-300 shadow-inner shadow-cyan-500/20">
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Panel de Administración
          </h1>
          <p className="mt-1.5 text-xs text-slate-400">
            Ingresa tus credenciales para gestionar los proyectos del portfolio.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-400" />
            <p className="flex-1 leading-relaxed">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-username" className="tag-mono block text-slate-300 mb-1.5">
              Usuario Administrador
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <User size={16} />
              </div>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej: lucas"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
          </div>

          <div>
            <label htmlFor="admin-password" className="tag-mono block text-slate-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                <Lock size={16} />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition-[filter,transform] hover:brightness-110 active:scale-[0.99] disabled:opacity-60 cursor-pointer shadow-lg shadow-cyan-500/10"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                Autenticando...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Iniciar Sesión
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
          <p className="tag-mono text-slate-500 text-[11px]">
            Conexión protegida con Spring Security & JWT (HMAC-SHA256)
          </p>
        </div>
      </div>
    </div>
  )
}
