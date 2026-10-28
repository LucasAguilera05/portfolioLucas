import { useState, useEffect, useRef, type FormEvent, type ChangeEvent, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle,
  Check,
  Code2,
  ExternalLink,
  Eye,
  Globe,
  Image as ImageIcon,
  Layers,
  Link as LinkIcon,
  Plus,
  Sparkles,
  Upload,
  Video,
  X,
} from 'lucide-react'
import type { Project, ProjectCategory, ProjectInput } from '../../types/project'
import { CATEGORIES, CATEGORY_LABELS } from '../../types/project'
import { createAdminProject, updateAdminProject, uploadMedia } from '../../services/projectService'
import { ProjectCard } from '../projects/ProjectCard'

interface ProjectFormModalProps {
  isOpen: boolean
  projectToEdit: Project | null
  onClose: () => void
  onSuccess: (project: Project) => void
}

const COMMON_TAGS = [
  'React',
  'TypeScript',
  'Java 21',
  'Spring Boot',
  'PostgreSQL',
  'Docker',
  'Redis',
  'RabbitMQ',
  'JWT',
  'Tailwind CSS',
  'REST API',
  'Spring Security',
]

export function ProjectFormModal({
  isOpen,
  projectToEdit,
  onClose,
  onSuccess,
}: ProjectFormModalProps) {
  const isEditing = Boolean(projectToEdit)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  // Estados del formulario
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [problemSolved, setProblemSolved] = useState('')
  const [architectureDetails, setArchitectureDetails] = useState('')
  const [category, setCategory] = useState<ProjectCategory>('WORK')
  const [featured, setFeatured] = useState(false)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [newTagInput, setNewTagInput] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [newImageInput, setNewImageInput] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [liveSystemUrl, setLiveSystemUrl] = useState('')
  const [demoEnvironmentUrl, setDemoEnvironmentUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')

  // Estados de proceso
  const [loading, setLoading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos cuando se abre para editar o resetear para nuevo
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title || '')
      setShortDescription(projectToEdit.shortDescription || '')
      setProblemSolved(projectToEdit.problemSolved || '')
      setArchitectureDetails(projectToEdit.architectureDetails || '')
      setCategory(projectToEdit.category || 'WORK')
      setFeatured(Boolean(projectToEdit.featured))
      setTechnologies(projectToEdit.technologies ? [...projectToEdit.technologies] : [])
      setThumbnailUrl(projectToEdit.thumbnailUrl || '')
      setImages(projectToEdit.images ? [...projectToEdit.images] : [])
      setVideoUrl(projectToEdit.videoUrl || '')
      setLiveSystemUrl(projectToEdit.liveSystemUrl || '')
      setDemoEnvironmentUrl(projectToEdit.demoEnvironmentUrl || '')
      setGithubUrl(projectToEdit.githubUrl || '')
    } else {
      setTitle('')
      setShortDescription('')
      setProblemSolved('')
      setArchitectureDetails('')
      setCategory('WORK')
      setFeatured(false)
      setTechnologies(['React', 'TypeScript', 'Java 21', 'Spring Boot', 'PostgreSQL'])
      setThumbnailUrl('')
      setImages([])
      setVideoUrl('')
      setLiveSystemUrl('')
      setDemoEnvironmentUrl('')
      setGithubUrl('')
    }
    setError(null)
  }, [projectToEdit, isOpen])

  // Objeto en tiempo real para el Live Preview
  const previewProject: Project = {
    id: projectToEdit ? projectToEdit.id : 0,
    title: title.trim() || 'Título de Ejemplo para la Card',
    shortDescription:
      shortDescription.trim() ||
      'Esta es una descripción previa de prueba que muestra cómo se organizará el texto en la tarjeta del portfolio.',
    problemSolved: problemSolved.trim(),
    architectureDetails: architectureDetails.trim(),
    category,
    featured,
    technologies: technologies.length > 0 ? technologies : ['React', 'Spring Boot', 'PostgreSQL'],
    thumbnailUrl: thumbnailUrl.trim() || null,
    images,
    videoUrl: videoUrl.trim() || null,
    liveSystemUrl: liveSystemUrl.trim() || null,
    demoEnvironmentUrl: demoEnvironmentUrl.trim() || null,
    githubUrl: githubUrl.trim() || null,
    createdAt: projectToEdit?.createdAt || '2026-10-28T12:00:00Z',
    updatedAt: projectToEdit?.updatedAt || '2026-10-28T12:00:00Z',
  }

  // Tags handlers
  const handleAddTag = (tagToAdd?: string) => {
    const val = (tagToAdd ?? newTagInput).trim()
    if (!val) return
    if (!technologies.some((t) => t.toLowerCase() === val.toLowerCase())) {
      setTechnologies((prev) => [...prev, val])
    }
    if (!tagToAdd) {
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTechnologies((prev) => prev.filter((t) => t !== tagToRemove))
  }

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Gallery handlers
  const handleAddGalleryUrl = () => {
    const trimmed = newImageInput.trim()
    if (trimmed && !images.includes(trimmed)) {
      setImages((prev) => [...prev, trimmed])
      setNewImageInput('')
    }
  }

  const handleRemoveGalleryImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // File Upload Handlers (Spring Boot /api/v1/admin/media/upload)
  const handleUploadCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    setError(null)
    try {
      const res = await uploadMedia(file)
      setThumbnailUrl(res.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen de portada.')
    } finally {
      setUploadingCover(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleUploadGalleryImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingGallery(true)
    setError(null)
    try {
      const res = await uploadMedia(file)
      setImages((prev) => [...prev, res.url])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen a la galería.')
    } finally {
      setUploadingGallery(false)
      if (galleryInputRef.current) galleryInputRef.current.value = ''
    }
  }

  // Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('El título del proyecto es obligatorio.')
      return
    }
    if (!shortDescription.trim()) {
      setError('La descripción corta es obligatoria.')
      return
    }
    if (shortDescription.length > 300) {
      setError('La descripción corta no puede superar los 300 caracteres.')
      return
    }

    setLoading(true)
    setError(null)

    const payload: ProjectInput = {
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      problemSolved: problemSolved.trim(),
      architectureDetails: architectureDetails.trim(),
      category,
      featured,
      technologies,
      thumbnailUrl: thumbnailUrl.trim(),
      images,
      videoUrl: videoUrl.trim(),
      liveSystemUrl: liveSystemUrl.trim(),
      demoEnvironmentUrl: demoEnvironmentUrl.trim(),
      githubUrl: githubUrl.trim(),
    }

    try {
      let result: Project
      if (isEditing && projectToEdit) {
        result = await updateAdminProject(projectToEdit.id, payload)
      } else {
        result = await createAdminProject(payload)
      }
      onSuccess(result)
      onClose()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Error al guardar el proyecto en el servidor.')
      } else {
        setError('Ocurrió un error inesperado al procesar la solicitud.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-form-title"
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black"
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
                <Code2 size={18} />
              </span>
              <div>
                <h2 id="modal-form-title" className="text-base sm:text-lg font-bold text-white">
                  {isEditing ? `Editar Proyecto: ${projectToEdit?.title}` : 'Crear Nuevo Proyecto'}
                </h2>
                <p className="tag-mono text-slate-400 text-[11px]">
                  Gestión en tiempo real conectada a PostgreSQL y Spring Boot
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </header>

          {/* Body: Split Layout */}
          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-200">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-rose-400" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-300">Error al procesar la solicitud</p>
                  <p className="mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Columna Izquierda: Formulario (7 columnas) */}
              <form id="project-form" onSubmit={handleSubmit} className="space-y-6 lg:col-span-7">
                {/* 1. Datos Básicos */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
                  <h3 className="tag-mono text-cyan-400 font-semibold uppercase flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    1. Datos Básicos
                  </h3>

                  <div>
                    <label htmlFor="f-title" className="tag-mono block text-slate-300 mb-1">
                      Título del Proyecto *
                    </label>
                    <input
                      id="f-title"
                      type="text"
                      required
                      maxLength={200}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="ej: PayFlow API — Motor de Conciliación Bancaria"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="f-category" className="tag-mono block text-slate-300 mb-1">
                        Categoría *
                      </label>
                      <select
                        id="f-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {CATEGORY_LABELS[cat]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center sm:pt-6">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950 cursor-pointer"
                        />
                        <div>
                          <span className="text-sm font-medium text-white flex items-center gap-1.5">
                            <Sparkles size={14} className="text-cyan-400" />
                            Proyecto Destacado
                          </span>
                          <span className="tag-mono block text-slate-500 text-[11px]">
                            Prioridad en la grilla principal
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="f-shortdesc" className="tag-mono text-slate-300">
                        Descripción Corta (Card principal) *
                      </label>
                      <span
                        className={`tag-mono text-[11px] ${
                          shortDescription.length > 280 ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      >
                        {shortDescription.length} / 300
                      </span>
                    </div>
                    <textarea
                      id="f-shortdesc"
                      required
                      maxLength={300}
                      rows={3}
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Descripción concisa de 2 o 3 líneas para la tarjeta frontal..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                {/* 2. Ingeniería y Arquitectura */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
                  <h3 className="tag-mono text-emerald-400 font-semibold uppercase flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    2. Ingeniería y Arquitectura (Modal de Estudio)
                  </h3>

                  <div>
                    <label htmlFor="f-problem" className="tag-mono block text-slate-300 mb-1">
                      Problema de Negocio Resuelto
                    </label>
                    <textarea
                      id="f-problem"
                      rows={3}
                      value={problemSolved}
                      onChange={(e) => setProblemSolved(e.target.value)}
                      placeholder="Explica qué cuello de botella, costo o dolor de negocio existía antes de este sistema..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="f-arch" className="tag-mono block text-slate-300 mb-1">
                      Detalles de Arquitectura & Decisiones Técnicas
                    </label>
                    <textarea
                      id="f-arch"
                      rows={4}
                      value={architectureDetails}
                      onChange={(e) => setArchitectureDetails(e.target.value)}
                      placeholder="Detalles de la arquitectura (Spring Boot 3, PostgreSQL, Docker, transaccionalidad, JWT, etc.)..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-600 transition-colors focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 3. Selector Dinámico de Tecnologías */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
                  <h3 className="tag-mono text-cyan-400 font-semibold uppercase flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    3. Tecnologías y Herramientas (Tags)
                  </h3>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Escribe una tecnología y presiona Enter o Añadir..."
                      className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
                    >
                      <Plus size={14} /> Añadir
                    </button>
                  </div>

                  {/* Chips activos */}
                  <div className="flex flex-wrap gap-2 min-h-8">
                    {technologies.map((t) => (
                      <span
                        key={t}
                        className="tag-mono inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 text-xs text-cyan-200"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="hover:text-rose-400 cursor-pointer"
                          aria-label={`Eliminar tag ${t}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Sugerencias Rápidas */}
                  <div>
                    <span className="tag-mono text-slate-500 text-[10px] block mb-1.5">
                      Sugerencias de un clic:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_TAGS.map((suggested) => {
                        const isAdded = technologies.includes(suggested)
                        return (
                          <button
                            key={suggested}
                            type="button"
                            onClick={() => (isAdded ? handleRemoveTag(suggested) : handleAddTag(suggested))}
                            className={`tag-mono inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] transition-colors cursor-pointer ${
                              isAdded
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            {isAdded ? <Check size={10} /> : <Plus size={10} />}
                            {suggested}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 4. Multimedia: Portada, Galería y Video */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
                  <h3 className="tag-mono text-sky-400 font-semibold uppercase flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    4. Multimedia (Imágenes y Video Demo)
                  </h3>

                  {/* Thumbnail / Portada */}
                  <div>
                    <label htmlFor="f-thumb" className="tag-mono block text-slate-300 mb-1">
                      URL de Portada (Thumbnail)
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <ImageIcon size={15} />
                        </div>
                        <input
                          id="f-thumb"
                          type="text"
                          value={thumbnailUrl}
                          onChange={(e) => setThumbnailUrl(e.target.value)}
                          placeholder="https://... o sube un archivo local"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadCover}
                      />
                      <button
                        type="button"
                        disabled={uploadingCover}
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                      >
                        {uploadingCover ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border border-white border-t-transparent" />
                            Subiendo...
                          </>
                        ) : (
                          <>
                            <Upload size={14} /> Subir
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Galería Adicional */}
                  <div>
                    <label className="tag-mono block text-slate-300 mb-1">
                      Galería de Capturas Adicionales ({images.length})
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newImageInput}
                        onChange={(e) => setNewImageInput(e.target.value)}
                        placeholder="Pegar URL de imagen..."
                        className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryUrl}
                        className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
                      >
                        Añadir
                      </button>
                      <input
                        type="file"
                        ref={galleryInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadGalleryImage}
                      />
                      <button
                        type="button"
                        disabled={uploadingGallery}
                        onClick={() => galleryInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                      >
                        <Upload size={14} /> Subir
                      </button>
                    </div>

                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {images.map((img, idx) => (
                          <div
                            key={idx}
                            className="group relative h-16 w-24 overflow-hidden rounded-lg border border-slate-800 bg-slate-950"
                          >
                            <img src={img} alt="" className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1 right-1 grid h-5 w-5 place-items-center rounded bg-slate-900/90 text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-rose-600 hover:text-white"
                              aria-label="Quitar imagen"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Demo */}
                  <div>
                    <label htmlFor="f-video" className="tag-mono block text-slate-300 mb-1">
                      URL de Video Demo (YouTube / Loom / MP4)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                        <Video size={15} />
                      </div>
                      <input
                        id="f-video"
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="ej: https://www.youtube.com/watch?v=... o https://loom.com/share/..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Enlaces Externos */}
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
                  <h3 className="tag-mono text-cyan-400 font-semibold uppercase flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    5. Enlaces y Despliegue
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="f-live" className="tag-mono block text-slate-300 mb-1">
                        Sistema en Vivo
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <Globe size={14} />
                        </div>
                        <input
                          id="f-live"
                          type="url"
                          value={liveSystemUrl}
                          onChange={(e) => setLiveSystemUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="f-demo" className="tag-mono block text-slate-300 mb-1">
                        Entorno Demo / Swagger
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <ExternalLink size={14} />
                        </div>
                        <input
                          id="f-demo"
                          type="url"
                          value={demoEnvironmentUrl}
                          onChange={(e) => setDemoEnvironmentUrl(e.target.value)}
                          placeholder="https://.../swagger"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="f-repo" className="tag-mono block text-slate-300 mb-1">
                        Repositorio GitHub
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                          <LinkIcon size={14} />
                        </div>
                        <input
                          id="f-repo"
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-2.5 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>

              {/* Columna Derecha: LIVE PREVIEW (5 columnas) */}
              <div className="lg:col-span-5">
                <div className="sticky top-2 space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/30 px-3.5 py-2 text-xs">
                    <span className="flex items-center gap-2 font-mono font-medium text-cyan-300">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                      </span>
                      Live Card Preview
                    </span>
                    <span className="tag-mono text-slate-400 text-[10px]">Renderizado en vivo</span>
                  </div>

                  {/* Render exacto de la Card del proyecto */}
                  <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl">
                    <ProjectCard project={previewProject} isLivePreview={true} />
                  </div>

                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/30 p-4 text-xs text-slate-400 space-y-2">
                    <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Eye size={14} className="text-cyan-400" /> Vista del Reclutador / Visitante
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      Esta tarjeta se sincroniza dinámicamente con cada cambio en el formulario. Al pulsar "Guardar", se persistirá inmediatamente en la base de datos PostgreSQL.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 tag-mono text-[10px]">
                      <span className="text-slate-500">ID: {previewProject.id || 'Nuevo'}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-cyan-400">Categoría: {category}</span>
                      <span className="text-slate-500">•</span>
                      <span className={featured ? 'text-amber-300' : 'text-slate-500'}>
                        {featured ? 'Destacado ⭐' : 'Estándar'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer del Modal */}
          <footer className="flex items-center justify-end gap-3 border-t border-slate-800/80 bg-slate-900/70 px-6 py-4">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="project-form"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-emerald-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  Guardando en BD...
                </>
              ) : (
                <>
                  <Layers size={14} />
                  {isEditing ? 'Actualizar Proyecto' : 'Guardar y Publicar'}
                </>
              )}
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
