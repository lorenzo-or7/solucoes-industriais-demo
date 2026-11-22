import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Info } from 'lucide-react'
import { useMemo, useState } from 'react'
import { projectFilters, projects, type ProjectFilter } from '../content/projects'
import { useBriefing } from '../hooks/useBriefing'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { SectionHead } from '../components/ui/SectionHead'
import { SmartImage } from '../components/ui/SmartImage'
import { EASE_PRECISE, Reveal } from '../components/ui/motion'
import { DetailList } from './Solutions'

const filterLabel = (id: string) => projectFilters.find((f) => f.id === id)?.label ?? id
const layout = [
  'lg:col-span-7 aspect-[4/3] lg:aspect-[16/11]',
  'lg:col-span-5 aspect-[4/3] lg:aspect-[4/5] lg:mt-24',
  'lg:col-span-5 aspect-[4/3] lg:aspect-[4/5]',
  'lg:col-span-7 aspect-[4/3] lg:aspect-[16/11] lg:mt-24',
]

export function Projects() {
  const [filter, setFilter] = useState<ProjectFilter>('todos')
  const [openId, setOpenId] = useState<string | null>(null)
  const reduce = useReducedMotion()

  const visible = useMemo(
    () => (filter === 'todos' ? projects : projects.filter((p) => p.tags.includes(filter))),
    [filter],
  )
  const counts = useMemo(
    () =>
      Object.fromEntries(
        projectFilters.map((f) => [f.id, f.id === 'todos' ? projects.length : projects.filter((p) => p.tags.includes(f.id as never)).length]),
      ) as Record<ProjectFilter, number>,
    [],
  )

  return (
    <section id="projetos" aria-labelledby="projetos-title" className="relative border-t border-line py-24 md:py-36">
      <div className="shell">
        <SectionHead
          index="04"
          label="Selected Applications"
          titleId="projetos-title"
          title={['Cenários de', 'aplicação']}
          aside={
            <>
              Estudos ilustrativos que mostram como as soluções se combinam em situações industriais típicas.
              <span className="mt-4 flex items-start gap-2 label-mono text-muted">
                <Info aria-hidden="true" className="size-3.5 shrink-0" />
                Cenários fictícios para demonstração — não representam projetos realizados.
              </span>
            </>
          }
        />

        {/* Filtros por especialidade */}
        <Reveal className="mt-14 flex flex-col gap-4 border-y border-line py-4 md:flex-row md:items-center md:justify-between">
          <div role="group" aria-label="Filtrar por especialidade" className="-mx-1 flex flex-wrap gap-1">
            {projectFilters.map((f) => {
              const selected = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(f.id)}
                  className={`relative inline-flex min-h-11 items-center gap-2 px-3.5 text-[0.9375rem] transition-colors duration-300 ${
                    selected ? 'text-accent-ink' : 'text-muted hover:text-fg'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="project-filter"
                      className="absolute inset-0 bg-accent"
                      transition={{ duration: reduce ? 0 : 0.5, ease: EASE_PRECISE }}
                    />
                  )}
                  <span className="relative">{f.label}</span>
                  <span className="label-mono relative text-[0.6875rem] opacity-80">{String(counts[f.id]).padStart(2, '0')}</span>
                </button>
              )
            })}
          </div>
          <p aria-live="polite" className="label-mono text-muted">
            {String(visible.length).padStart(2, '0')} {visible.length === 1 ? 'cenário' : 'cenários'} ·{' '}
            {filter === 'todos' ? 'todas as especialidades' : filterLabel(filter)}
          </p>
        </Reveal>

        {visible.length === 0 ? (
          <div className="mt-12 border border-dashed border-line p-10 text-center">
            <p className="text-muted">Nenhum cenário corresponde a este filtro.</p>
            <Button variant="ghost" magnetic={false} className="mt-6" onClick={() => setFilter('todos')}>
              Ver todos os cenários
            </Button>
          </div>
        ) : (
          <motion.ul layout className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((p, i) => (
                <motion.li
                  key={p.id}
                  layout
                  className={layout[i % layout.length].split(' ').filter((c) => c.startsWith('lg:col') || c.startsWith('lg:mt')).join(' ')}
                  initial={{ opacity: 0, y: reduce ? 0 : 40, clipPath: reduce ? 'none' : 'inset(10% 0% 0% 0%)' }}
                  animate={{ opacity: 1, y: 0, clipPath: reduce ? 'none' : 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 0, scale: reduce ? 1 : 0.96, transition: { duration: 0.25 } }}
                  transition={{ duration: reduce ? 0.2 : 0.8, ease: EASE_PRECISE }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(p.id)}
                    className="group block w-full text-left"
                    aria-label={`Explorar cenário: ${p.title}`}
                  >
                    <div
                      className={`relative w-full overflow-hidden ${layout[i % layout.length]
                        .split(' ')
                        .filter((c) => c.includes('aspect'))
                        .join(' ')}`}
                    >
                      <SmartImage
                        image={p.image}
                        sizes="(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw"
                        className="absolute inset-0 h-full w-full"
                        imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-precise)] group-hover:scale-[1.05]"
                        decorative
                      />
                      <div className="scope-dark absolute inset-x-0 top-0 flex items-start justify-between p-4">
                        <span className="label-mono bg-[rgb(11_14_17/0.75)] px-2 py-1 text-fg">Cenário ilustrativo</span>
                        <span className="inline-flex size-11 items-center justify-center bg-accent text-accent-ink transition-transform duration-500 group-hover:rotate-45">
                          <ArrowUpRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-line pt-4">
                      <span className="label-mono pt-1.5 text-accent">{p.code}</span>
                      <div>
                        <h3 className="text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-[1.1] tracking-[-0.025em] transition-colors duration-300 group-hover:text-accent">
                          {p.title}
                        </h3>
                        <p className="mt-3 max-w-[52ch] leading-relaxed text-muted">{p.summary}</p>
                        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1" aria-label="Especialidades">
                          {p.tags.map((t) => (
                            <li key={t} className="label-mono text-muted">
                              / {filterLabel(t)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <ProjectModal
        openId={openId}
        list={visible.map((p) => p.id)}
        onClose={() => setOpenId(null)}
        onNavigate={setOpenId}
      />
    </section>
  )
}

function ProjectModal({
  openId,
  list,
  onClose,
  onNavigate,
}: {
  openId: string | null
  list: string[]
  onClose: () => void
  onNavigate: (id: string) => void
}) {
  const reduce = useReducedMotion()
  const { requestProposal } = useBriefing()
  const project = projects.find((p) => p.id === openId) ?? null
  const pos = openId ? list.indexOf(openId) : -1
  const go = (dir: 1 | -1) => {
    if (pos < 0 || list.length < 2) return
    onNavigate(list[(pos + dir + list.length) % list.length])
  }

  return (
    <Dialog
      open={Boolean(project)}
      onClose={onClose}
      variant="modal"
      title={project ? `${project.code} — Cenário ilustrativo` : 'Cenário'}
      labelledBy="project-modal-title"
      contentKey={openId}
      onKeyDown={(e) => {
        const tag = (e.target as HTMLElement).tagName
        if (tag === 'BUTTON' || tag === 'A') return
        if (e.key === 'ArrowRight') go(1)
        if (e.key === 'ArrowLeft') go(-1)
      }}
    >
      {project && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={project.id}
            className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:sticky lg:top-0 lg:aspect-auto lg:h-[calc(100svh-3rem-3.75rem)] lg:max-h-[52rem]">
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { scale: 1.1, clipPath: 'inset(0% 100% 0% 0%)' }}
                animate={{ scale: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 0.9, ease: EASE_PRECISE }}
              >
                <SmartImage image={project.image} sizes="(min-width: 1024px) 40vw, 100vw" className="h-full w-full" />
              </motion.div>
            </div>
            <div className="px-5 py-8 md:px-10 md:py-12">
              <p className="inline-flex items-center gap-2 border border-accent px-2.5 py-1.5 label-mono text-accent">
                <Info aria-hidden="true" className="size-3.5" />
                Cenário ilustrativo — não representa um projeto realizado
              </p>
              <p className="label-mono mt-8 text-muted">
                {project.code} · {project.sector}
              </p>
              <h3 id="project-modal-title" className="display mt-3 text-[clamp(2rem,4.4vw,3.75rem)]">
                {project.title}
              </h3>

              <div className="mt-8 border-t border-line pt-6">
                <h4 className="label-mono text-muted">Contexto</h4>
                <p className="mt-3 text-[1.0625rem] leading-relaxed">{project.context}</p>
              </div>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <DetailList title="Objetivos" items={project.objectives} />
                <DetailList title="Soluções aplicadas" items={project.solutions} />
              </div>

              <div className="mt-10 border-t border-line pt-6">
                <h4 className="label-mono text-muted">Escopo envolvido</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.scope.map((s) => (
                    <li key={s} className="label-mono border border-line px-2.5 py-1.5">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  magnetic={false}
                  onClick={() => {
                    onClose()
                    window.setTimeout(() => requestProposal(), 320)
                  }}
                >
                  Discutir um desafio parecido
                </Button>
                {list.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-fg"
                      aria-label="Cenário anterior"
                    >
                      <ArrowLeft aria-hidden="true" className="size-4" />
                    </button>
                    <span className="label-mono w-14 text-center text-muted">
                      {String(pos + 1).padStart(2, '0')}/{String(list.length).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-fg"
                      aria-label="Próximo cenário"
                    >
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      )}
    </Dialog>
  )
}
