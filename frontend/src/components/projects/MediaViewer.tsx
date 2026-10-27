import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Project } from '../../data/projects'

interface MediaViewerProps {
  project: Project
}

function VideoPlayer({ video, title }: { video: NonNullable<Project['video']>; title: string }) {
  if (video.type === 'file') {
    return (
      <video
        controls
        preload="metadata"
        poster={video.poster}
        className="aspect-video w-full rounded-xl bg-black"
        aria-label={`Video demo de ${title}`}
      >
        <source src={video.url} />
      </video>
    )
  }
  return (
    <iframe
      src={video.url}
      title={`Video demo de ${title}`}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="aspect-video w-full rounded-xl border border-slate-800 bg-black"
    />
  )
}

export function MediaViewer({ project }: MediaViewerProps) {
  const [tab, setTab] = useState<'video' | 'shots'>(project.video ? 'video' : 'shots')
  const [index, setIndex] = useState(0)
  const shots = project.screenshots
  const go = (d: number) => setIndex((i) => (i + d + shots.length) % shots.length)

  return (
    <div>
      {project.video && (
        <div role="tablist" aria-label="Tipo de medio" className="mb-3 inline-flex rounded-lg border border-slate-800 bg-slate-950/60 p-1">
          {(['video', 'shots'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`tag-mono rounded-md px-3 py-1.5 transition-colors duration-200 ${
                tab === t ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-200'
              }`}
            >
              {t === 'video' ? 'Video' : `Capturas (${shots.length})`}
            </button>
          ))}
        </div>
      )}

      {tab === 'video' && project.video ? (
        <VideoPlayer video={project.video} title={project.title} />
      ) : (
        <div>
          <div className="relative overflow-hidden rounded-xl border border-slate-800">
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
            <ul className="mt-3 flex gap-2">
              {shots.map((s, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Ver captura ${i + 1}`}
                    aria-current={i === index}
                    className={`block h-14 w-24 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                      i === index ? 'border-cyan-400' : 'border-slate-800 opacity-60 hover:opacity-100'
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
