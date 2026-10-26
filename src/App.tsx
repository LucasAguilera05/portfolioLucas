import { Hero } from './components/hero/Hero'
import { Navbar } from './components/layout/Navbar'
import { ProjectsSection } from './components/projects/ProjectsSection'

export default function App() {
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
            <a href="mailto:tu@email.com" className="mt-2 block text-lg font-semibold text-white hover:text-cyan-200">
              [EMAIL_ADDRESS]
            </a>
          </div>
          <p className="tag-mono text-slate-600">© {new Date().getFullYear()} · React · Spring Boot · PostgreSQL</p>
        </div>
      </footer>
    </>
  )
}
