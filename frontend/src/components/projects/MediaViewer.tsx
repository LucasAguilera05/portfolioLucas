import { useState } from 'react'
import { ChevronLeft, ChevronRight, Image as ImageIcon, PlayCircle } from 'lucide-react'
import type { Project } from '../../types/project'
import { getEmbedVideoUrl, getProjectCoverUrl } from '../../utils/projectAdapter'
import { resolveMediaUrl } from '../../services/projectService'

interface MediaViewerProps {
  project: Project
}

function VideoPlayer({ embed, title }: { embed: { type: 'embed' | 'file'; src: string }; title: string }) {
  if (embed.type === 'file') {
    return (
      <video
        controls
        preload="metadata"
        className="aspect-video w-full rounded-xl bg-black shadow-lg"
        aria-label={`Video demo de ${title}`}
      >
        <source src={embed.src} />
        Tu navegador no soporta el tag de video.
      </video>
    )
  }
  return (
    <iframe
      src={embed.src}
      title={`Video demo de ${title}`}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="aspect-video w-full rounded-xl border border-slate-800 bg-black shadow-lg"
    />
  )
}

export function MediaViewer({ project }: MediaViewerProps) {
  const embed = getEmbedVideoUrl(project.videoUrl)
  const hasVideo = Boolean(embed)

  // Recopilar galería: imágenes explícitas o portada
  const rawShots = (project.images && project.images.length > 0)
    ? project.images
    : (project.thumbnailUrl ? [project.thumbnailUrl] : [])

  const shots = rawShots.length > 0
    ? rawShots.map((img) => resolveMediaUrl(img))
    : [getProjectCoverUrl(project)]

  const [tab, setTab] = useState<'video' | 'shots'>(hasVideo ? 'video' : 'shots')
  const [index, setIndex] = useState(0)

  const go = (d: number) => setIndex((i) => (i + d + shots.length) % shots.length)

  return (
    <div>
      {hasVideo && (
        <div
          role="tablist"
          aria-label="Tipo de medio"
          className="mb-3 inline-flex rounded-lg border border-slate-800 bg-slate-950/60 p-1"
        >
          <button
            role="tab"
            type="button"
            aria-selected={tab === 'video'}
            onClick={() => setTab('video')}
            className={`tag-mono inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors duration-200 ${
              tab === 'video' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <PlayCircle size={14} className="text-cyan-300" aria-hidden="true" />
            Video Demo
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={tab === 'shots'}
            onClick={() => setTab('shots')}
            className={`tag-mono inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors duration-200 ${
              tab === 'shots' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-200'
            }`}
          >
            <ImageIcon size={14} className="text-slate-400" aria-hidden="true" />
            Capturas ({shots.length})
          </button>
        </div>
      )}

      {tab === 'video' && embed ? (
        <VideoPlayer embed={embed} title={project.title} />
      ) : (
        <div>
          <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            <img
              key={index}
              src={shots[index]}
              alt={`Captura ${index + 1} de ${shots.length} de ${project.title}`}
              className="aspect-video w-full object-cover"
            />
            {shots.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Captura anterior"
                  className="absolute top-1/2 left-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-700 bg-slate-950/80 text-white backdrop-blur-md transition-colors hover:bg-slate-800"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Captura siguiente"
                  className="absolute top-1/2 right-3 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-slate-700 bg-slate-950/80 text-white backdrop-blur-md transition-colors hover:bg-slate-800"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {shots.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Miniaturas de capturas">
              {shots.map((s, i) => (
                <li key={i} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver captura ${i + 1}`}
                    aria-current={i === index}
                    className={`block h-14 w-24 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      i === index ? 'border-cyan-400 shadow-md shadow-cyan-500/20' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={s} alt="" className="h-full w-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
