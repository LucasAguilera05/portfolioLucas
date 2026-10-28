import { Hero } from '../../components/hero/Hero'
import { Navbar } from '../../components/layout/Navbar'
import { ProjectsSection } from '../../components/projects/ProjectsSection'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export function PublicPortfolioPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProjectsSection />
        <section id="experiencia" className="container-page py-16">
          <p className="tag-mono text-cyan-300">// 02 — experiencia</p>
          <p className="mt-3 text-slate-500">Próxima iteración.</p>
        </section>
      </main>
      <footer id="contacto" className="border-t border-slate-800/80 py-12">
        <div className="container-page flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="tag-mono text-cyan-300">// contacto</p>
            <a
              href="mailto:lucasaguilera0506@gmail.com"
              className="mt-2 block text-lg font-semibold text-white hover:text-cyan-200"
            >
              lucasaguilera0506@gmail.com
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="tag-mono text-slate-600">
              © 2026 · React · Spring Boot · PostgreSQL
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 tag-mono text-xs text-slate-500 hover:text-cyan-300 transition-colors border border-slate-800 rounded-lg px-2.5 py-1 bg-slate-900/40"
              title="Panel de Administración CMS"
            >
              <Shield size={12} />
              CMS Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
