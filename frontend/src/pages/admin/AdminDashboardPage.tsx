import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  ExternalLink,
  Filter,
  FolderCode,
  Layers,
  Pencil,
  PlayCircle,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'
import type { Project, ProjectCategory } from '../../types/project'
import { CATEGORIES, CATEGORY_LABELS } from '../../types/project'
import { deleteAdminProject, getPublicProjects } from '../../services/projectService'
import { getProjectCoverUrl } from '../../utils/projectAdapter'
import { AdminHeader } from '../../components/admin/AdminHeader'
import { ProjectFormModal } from '../../components/admin/ProjectFormModal'
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal'
import { TechBadge } from '../../components/ui/TechBadge'

export function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all')

  // Modales
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Carga de proyectos
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPublicProjects()
      setProjects(data)
    } catch (err) {
      console.error('Error al cargar proyectos en el dashboard:', err)
      showToast('Error al conectar con la API de proyectos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // KPIs Estadísticos
  const stats = useMemo(() => {
    const total = projects.length
    const inProduction = projects.filter(
      (p) => Boolean(p.liveSystemUrl?.trim()) || p.category === 'WORK',
    ).length
    const withVideo = projects.filter((p) => Boolean(p.videoUrl?.trim())).length
    const featured = projects.filter((p) => p.featured).length

    return { total, inProduction, withVideo, featured }
  }, [projects])

  // Filtro y Búsqueda combinada
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory
      const query = search.toLowerCase().trim()
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.shortDescription.toLowerCase().includes(query) ||
        p.technologies?.some((t) => t.toLowerCase().includes(query))
      return matchesCategory && matchesSearch
    })
  }, [projects, selectedCategory, search])

  // Handlers para Crear/Editar
  const handleOpenCreate = () => {
    setProjectToEdit(null)
    setFormModalOpen(true)
  }

  const handleOpenEdit = (p: Project) => {
    setProjectToEdit(p)
    setFormModalOpen(true)
  }

  const handleFormSuccess = (saved: Project) => {
    showToast(
      projectToEdit
        ? `Proyecto "${saved.title}" actualizado con éxito.`
        : `Proyecto "${saved.title}" creado con éxito.`,
    )
    fetchProjects()
  }

  // Handlers para Eliminar
  const handleOpenDelete = (p: Project) => {
    setProjectToDelete(p)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return
    setDeleting(true)
    try {
      await deleteAdminProject(projectToDelete.id)
      showToast(`Proyecto "${projectToDelete.title}" eliminado correctamente.`)
      setDeleteModalOpen(false)
      setProjectToDelete(null)
      fetchProjects()
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar el proyecto.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30">
      <AdminHeader />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-100 animate-slide-up rounded-2xl border border-cyan-500/30 bg-slate-900 px-5 py-3.5 text-xs text-white shadow-2xl shadow-cyan-500/10 flex items-center gap-3">
          <span className="grid h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <p className="font-mono">{toastMessage}</p>
        </div>
      )}

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Banner Superior & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Layers className="text-cyan-400" size={28} />
              Gestión de Proyectos
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Administra las tarjetas, casos de estudio y contenido multimedia que se muestran en tu portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              title="Sincronizar proyectos con el backend"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-slate-300 hover:border-slate-700 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
              Sincronizar
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
            >
              <Plus size={16} />
              Nuevo Proyecto
            </button>
          </div>
        </div>

        {/* 1. Header Estadístico (4 Tarjetas KPI) */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Total Proyectos */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="tag-mono text-xs">Total Proyectos</span>
              <FolderCode size={18} className="text-cyan-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-white tracking-tight">
              {loading ? '-' : stats.total}
            </p>
            <p className="mt-1 tag-mono text-[11px] text-slate-500">Persistidos en PostgreSQL</p>
          </div>

          {/* En Producción */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="tag-mono text-xs text-emerald-300">En Producción</span>
              <Radio size={18} className="text-emerald-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-emerald-400 tracking-tight">
              {loading ? '-' : stats.inProduction}
            </p>
            <p className="mt-1 tag-mono text-[11px] text-slate-500">Con enlace en vivo</p>
          </div>

          {/* Con Video Demo */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="tag-mono text-xs">Con Video Demo</span>
              <PlayCircle size={18} className="text-sky-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-sky-400 tracking-tight">
              {loading ? '-' : stats.withVideo}
            </p>
            <p className="mt-1 tag-mono text-[11px] text-slate-500">YouTube / Loom / MP4</p>
          </div>

          {/* Destacados */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/20 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400">
              <span className="tag-mono text-xs text-amber-300">Destacados</span>
              <Sparkles size={18} className="text-amber-400" />
            </div>
            <p className="mt-3 text-3xl font-bold text-amber-400 tracking-tight">
              {loading ? '-' : stats.featured}
            </p>
            <p className="mt-1 tag-mono text-[11px] text-slate-500">Visibles primero en portada</p>
          </div>
        </div>

        {/* 2. Barra de Filtros y Búsqueda */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título, tecnología o descripción..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Filter size={14} className="text-slate-500 shrink-0" />
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`tag-mono px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos ({projects.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = projects.filter((p) => p.category === cat).length
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`tag-mono px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {CATEGORY_LABELS[cat]} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. Tabla / Grilla de Gestión */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-800/40 animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-16 text-center">
              <FolderCode size={36} className="mx-auto text-slate-600 mb-3" />
              <p className="text-base font-semibold text-slate-300">No se encontraron proyectos</p>
              <p className="text-xs text-slate-500 mt-1">
                {search || selectedCategory !== 'all'
                  ? 'Prueba a cambiar el filtro de búsqueda o categoría.'
                  : 'Haz clic en "Nuevo Proyecto" para agregar el primero.'}
              </p>
              {!(search || selectedCategory !== 'all') && (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/50 cursor-pointer"
                >
                  <Plus size={14} /> Crear Primer Proyecto
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 tag-mono text-slate-400">
                    <th className="py-3.5 pl-6 pr-3 w-16">Portada</th>
                    <th className="py-3.5 px-3">Proyecto</th>
                    <th className="py-3.5 px-3">Categoría</th>
                    <th className="py-3.5 px-3">Tecnologías</th>
                    <th className="py-3.5 px-3 text-center">Estado</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProjects.map((p) => {
                    const cover = getProjectCoverUrl(p)
                    return (
                      <tr
                        key={p.id}
                        className="transition-colors hover:bg-slate-800/40 group"
                      >
                        {/* Portada */}
                        <td className="py-3 pl-6 pr-3">
                          <div className="h-12 w-18 overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shrink-0">
                            <img src={cover} alt="" className="h-full w-full object-cover" />
                          </div>
                        </td>

                        {/* Título & Descripción */}
                        <td className="py-3 px-3 max-w-xs sm:max-w-md">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">
                              {p.title}
                            </span>
                            {p.featured && (
                              <span className="tag-mono inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] border border-cyan-500/30 bg-cyan-950/50 text-cyan-300">
                                <Sparkles size={10} /> Destacado
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                            {p.shortDescription}
                          </p>
                        </td>

                        {/* Categoría */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="tag-mono rounded-md border border-slate-800 bg-slate-950 px-2 py-1 text-slate-300">
                            {CATEGORY_LABELS[p.category] || p.category}
                          </span>
                        </td>

                        {/* Tecnologías */}
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {p.technologies?.slice(0, 3).map((t) => (
                              <TechBadge key={t} name={t} className="text-[10px] px-1.5 py-0.5" />
                            ))}
                            {p.technologies && p.technologies.length > 3 && (
                              <span className="tag-mono text-slate-500 text-[10px] self-center">
                                +{p.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Badges de Estado */}
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {p.liveSystemUrl ? (
                              <span
                                title="Sistema en producción disponible"
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400"
                              >
                                <Radio size={12} /> Live
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono text-[11px]">-</span>
                            )}
                            {p.videoUrl && (
                              <span
                                title="Video Demo disponible"
                                className="inline-flex items-center gap-1 text-[11px] font-mono text-sky-400"
                              >
                                <PlayCircle size={12} /> Video
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Acciones Rápidas */}
                        <td className="py-3 pl-3 pr-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            {p.liveSystemUrl && (
                              <a
                                href={p.liveSystemUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Abrir sistema en vivo"
                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              title="Editar proyecto"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                            >
                              <Pencil size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenDelete(p)}
                              title="Eliminar proyecto"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-rose-400 hover:border-rose-500/40 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Creación / Edición con Live Preview */}
      <ProjectFormModal
        isOpen={formModalOpen}
        projectToEdit={projectToEdit}
        onClose={() => {
          setFormModalOpen(false)
          setProjectToEdit(null)
        }}
        onSuccess={handleFormSuccess}
      />

      {/* Modal de Confirmación para Eliminar */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title={projectToDelete?.title || ''}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleting) {
            setDeleteModalOpen(false)
            setProjectToDelete(null)
          }
        }}
      />
    </div>
  )
}
