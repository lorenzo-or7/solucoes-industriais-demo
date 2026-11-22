import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { capabilities } from '../content/capabilities'
import { solutions } from '../content/solutions'
import { SectionHead } from '../components/ui/SectionHead'
import { SmartImage } from '../components/ui/SmartImage'
import { EASE_MACHINE, EASE_PRECISE, Reveal } from '../components/ui/motion'

export function Capabilities() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const reduce = useReducedMotion()
  const cap = capabilities[active]

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = capabilities.length
    let next: number | null = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next !== null) {
      e.preventDefault()
      setActive(next)
      tabsRef.current[next]?.focus()
    }
  }

  return (
    <section id="especialidades" aria-labelledby="especialidades-title" className="relative border-t border-line bg-surface py-24 md:py-36">
      <div className="shell">
        <SectionHead
          index="03"
          label="Engineering Capabilities"
          titleId="especialidades-title"
          title={['Capacidades', 'de engenharia']}
          aside="Quatro competências que sustentam cada solução — do levantamento em campo ao suporte depois da partida."
        />

        <Reveal className="mt-16 grid gap-px border border-line bg-line lg:grid-cols-12" y={40}>
          {/* Seletor — painel de instrumentos */}
          <div
            role="tablist"
            aria-label="Capacidades técnicas"
            aria-orientation="vertical"
            className="grid grid-cols-2 gap-px bg-line lg:col-span-4 lg:grid-cols-1"
          >
            {capabilities.map((c, i) => {
              const selected = active === i
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabsRef.current[i] = el
                  }}
                  role="tab"
                  id={`cap-tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`cap-panel-${c.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`group relative flex min-h-[7.5rem] flex-col justify-between gap-6 p-4 text-left transition-colors duration-500 sm:p-6 lg:min-h-0 lg:flex-1 ${
                    selected ? 'bg-bg' : 'bg-surface hover:bg-surface-2'
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="cap-indicator"
                      className="absolute inset-y-0 left-0 w-[3px] bg-accent max-lg:inset-x-0 max-lg:bottom-auto max-lg:h-[3px] max-lg:w-auto"
                      transition={{ duration: reduce ? 0 : 0.55, ease: EASE_PRECISE }}
                    />
                  )}
                  <span className="flex items-center justify-between gap-3">
                    <span className={`label-mono ${selected ? 'text-accent' : 'text-muted'}`}>{c.code}</span>
                    {/* LED de estado */}
                    <span
                      aria-hidden="true"
                      className={`size-2 transition-colors duration-500 ${selected ? 'bg-accent' : 'bg-line-strong'}`}
                    />
                  </span>
                  <span className="text-[clamp(1.0625rem,2.2vw,1.5rem)] font-medium leading-tight tracking-[-0.02em]">
                    {c.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Painel contextual */}
          <div
            role="tabpanel"
            id={`cap-panel-${cap.id}`}
            aria-labelledby={`cap-tab-${cap.id}`}
            tabIndex={0}
            className="relative bg-bg lg:col-span-8"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-2 lg:aspect-[16/8]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={cap.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 0% 100%)' }}
                  animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: reduce ? 0.2 : 0.9, ease: EASE_MACHINE }}
                >
                  <motion.div
                    className="h-full w-full"
                    initial={reduce ? false : { scale: 1.12 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.4, ease: EASE_PRECISE }}
                  >
                    <SmartImage image={cap.image} sizes="(min-width: 1024px) 60vw, 100vw" className="h-full w-full" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              {/* Marcações de instrumento */}
              <div aria-hidden="true" className="scope-dark pointer-events-none absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
                <div className="flex justify-between">
                  <span className="label-mono bg-[rgb(11_14_17/0.7)] px-2 py-1 text-fg">{cap.code}</span>
                  <span className="label-mono bg-[rgb(11_14_17/0.7)] px-2 py-1 text-fg">
                    {String(active + 1).padStart(2, '0')}/{String(capabilities.length).padStart(2, '0')}
                  </span>
                </div>
                <div className="ruler w-full opacity-60" />
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cap.id}
                className="grid gap-10 p-5 sm:p-8 xl:grid-cols-[1.1fr_1fr] xl:p-10"
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_PRECISE, delay: reduce ? 0 : 0.15 } }}
                exit={{ opacity: 0, y: reduce ? 0 : -10, transition: { duration: 0.2 } }}
              >
                <div>
                  <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.12] tracking-[-0.025em]">
                    {cap.lead}
                  </h3>
                  <p className="mt-5 leading-relaxed text-muted">{cap.description}</p>
                  <div className="mt-7">
                    <p className="label-mono text-muted">Entregáveis</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {cap.deliverables.map((d) => (
                        <li key={d} className="label-mono border border-line px-2.5 py-1.5">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <dl className="self-start border-t border-line">
                  {cap.details.map((d) => (
                    <div key={d.label} className="border-b border-line py-4">
                      <dt className="label-mono text-accent">{d.label}</dt>
                      <dd className="mt-2 leading-snug">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <CapabilityMatrix active={active} onSelect={setActive} />
      </div>
    </section>
  )
}

/** Matriz real de relacionamento: capacidades × soluções. */
function CapabilityMatrix({ active, onSelect }: { active: number; onSelect: (i: number) => void }) {
  return (
    <Reveal className="mt-14 md:mt-20">
      <div className="flex items-center justify-between gap-4">
        <h3 className="label-mono text-fg">Matriz de aplicação</h3>
        <p className="label-mono hidden text-muted sm:block">● atuação direta da capacidade na solução</p>
      </div>
      <div className="mt-5 overflow-x-auto no-scrollbar">
        <table className="w-full border-collapse text-left md:min-w-[36rem]">
          <caption className="sr-only">
            Relação entre capacidades técnicas e soluções. Uma marca indica atuação direta da capacidade na solução.
          </caption>
          <thead>
            <tr className="border-y border-line">
              <th scope="col" className="label-mono w-[40%] py-3 pr-3 font-normal text-muted sm:w-[34%] sm:pr-4">
                Capacidade
              </th>
              {solutions.map((s) => (
                <th key={s.id} scope="col" className="label-mono px-1 py-3 text-center font-normal text-muted sm:px-2">
                  <span className="hidden md:inline">{s.short}</span>
                  <span className="md:hidden" title={s.title}>
                    {s.code.replace('SYS-', '')}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capabilities.map((c, i) => {
              const isActive = i === active
              return (
                <tr key={c.id} className={`border-b border-line transition-colors duration-500 ${isActive ? 'bg-accent-soft' : ''}`}>
                  <th scope="row" className="py-0 pr-3 font-normal sm:pr-4">
                    <button
                      type="button"
                      onClick={() => onSelect(i)}
                      aria-pressed={isActive}
                      className="flex min-h-12 w-full flex-col items-start justify-center gap-0.5 py-2 text-left sm:flex-row sm:items-center sm:gap-3"
                    >
                      <span className={`label-mono ${isActive ? 'text-accent' : 'text-muted'}`}>{c.code}</span>
                      <span className={`text-[0.875rem] leading-tight sm:text-base ${isActive ? 'text-fg' : 'text-muted'}`}>{c.title}</span>
                    </button>
                  </th>
                  {solutions.map((s) => {
                    const on = c.solutions.includes(s.id)
                    return (
                      <td key={s.id} className="px-1 text-center sm:px-2">
                        <span
                          aria-label={on ? 'Atuação direta' : 'Sem atuação direta'}
                          role="img"
                          className={`mx-auto block size-3 transition-all duration-500 ${
                            on ? (isActive ? 'bg-accent' : 'bg-fg/70') : 'border border-line-strong'
                          } ${on && isActive ? 'scale-125' : ''}`}
                        />
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 md:hidden" aria-label="Legenda das soluções">
        {solutions.map((s) => (
          <li key={s.id} className="label-mono text-muted">
            {s.code.replace('SYS-', '')} — {s.short}
          </li>
        ))}
      </ul>
    </Reveal>
  )
}
