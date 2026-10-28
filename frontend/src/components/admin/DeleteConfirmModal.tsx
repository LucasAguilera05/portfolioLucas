import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  title: string
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  isOpen,
  title,
  loading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, loading, onCancel])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!loading) onCancel()
          }}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Panel */}
        <motion.div
          ref={panelRef}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl shadow-black/80"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 id="delete-title" className="text-base font-semibold text-white">
                  Eliminar Proyecto
                </h3>
                <p className="tag-mono text-rose-300/80 text-[11px]">Acción irreversible</p>
              </div>
            </div>
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-800 hover:text-white cursor-pointer disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            ¿Estás seguro de que deseas eliminar permanentemente el proyecto{' '}
            <span className="font-semibold text-white">"{title}"</span>? Esta acción lo borrará de la base de datos PostgreSQL.
          </p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={onCancel}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={onConfirm}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 active:scale-95 transition-all shadow-md shadow-rose-900/30 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Eliminar Definitivamente
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
