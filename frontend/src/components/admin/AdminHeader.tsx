import { Link, useNavigate } from 'react-router-dom'
import { ExternalLink, LogOut, ShieldCheck } from 'lucide-react'
import { clearAuthSession, getStoredUser } from '../../services/projectService'

export function AdminHeader() {
  const navigate = useNavigate()
  const username = getStoredUser() || 'Admin'

  const handleLogout = () => {
    clearAuthSession()
    navigate('/admin/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 text-white">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-linear-to-br from-sky-400 to-emerald-400 font-mono text-sm font-bold text-slate-950">
              &lt;/&gt;
            </span>
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight text-white text-sm">Portfolio CMS</span>
              <span className="tag-mono text-cyan-400 text-[10px]">Panel de Administración</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
          >
            Ver Sitio Público
            <ExternalLink size={13} className="text-slate-400" />
          </Link>

          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="font-mono text-slate-200">{username}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/20 active:scale-95 cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
