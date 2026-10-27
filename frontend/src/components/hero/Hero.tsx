import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { StackBentoCard } from './StackBentoCard'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const } }),
}

export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/4 h-120 w-120 rounded-full bg-cyan-500/15 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-20 right-0 h-100 w-100 rounded-full bg-emerald-500/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="tag-mono inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/60 py-1.5 pr-4 pl-2.5 text-slate-300 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-cyan-300" aria-hidden="true" />
            Ingeniería en Sistemas (Último Año) • +2 años de experiencia
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Full Stack Developer
            <span className="mt-2 block text-gradient">React + Spring Boot + PostgreSQL</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            Diseño y construyo sistemas escalables de extremo a extremo: arquitecturas limpias, APIs robustas y
            interfaces que la gente disfruta usar — del modelo de datos al último píxel.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <a
              href="#proyectos"
              className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-[filter,box-shadow] duration-200 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-[0.98]"
            >
              Explorar Sistemas
              <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:border-slate-500 hover:bg-slate-800/80 active:scale-[0.98]"
            >
              <Mail size={16} aria-hidden="true" />
              Contactar
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a
                href="https://github.com/LucasAguilera05"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-11 w-11 place-items-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-800/70 hover:text-white"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/tu-usuario"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="grid h-11 w-11 place-items-center rounded-xl text-slate-400 transition-colors duration-200 hover:bg-slate-800/70 hover:text-white"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        <StackBentoCard />
      </div>
    </section>
  )
}
