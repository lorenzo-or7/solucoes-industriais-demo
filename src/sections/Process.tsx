import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { processSteps } from '../content/process'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { SectionHead } from '../components/ui/SectionHead'
import { SmartImage } from '../components/ui/SmartImage'
import { EASE_MACHINE, EASE_PRECISE, Reveal, TechLine } from '../components/ui/motion'

export function Process() {
  const desktop = useMediaQuery('(min-width: 1024px)')
  return (
    <section id="processo" aria-labelledby="processo-title" className="relative border-t border-line">
      <div className="shell pt-24 md:pt-36">
        <SectionHead
          index="05"
          label="From Challenge to Solution"
          titleId="processo-title"
          title={['Do desafio', 'à solução']}
          aside="Uma metodologia em quatro etapas, com entregas claras em cada fase. Cada etapa só avança com critérios de aceite definidos."
        />
      </div>
      {desktop ? <DesktopFlow /> : <MobileFlow />}
    </section>
  )
}

function DesktopFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const n = processSteps.length

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(n - 1, Math.max(0, Math.floor(p * n * 0.999))))
  })

  const goTo = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (range * (i + 0.5)) / n, behavior: reduce ? 'auto' : 'smooth' })
  }

  const step = processSteps[active]

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 85 + 15}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="shell grid w-full grid-cols-12 gap-10 pt-16">
          {/* Trilho de progresso */}
          <ol className="relative col-span-4 flex flex-col" aria-label="Etapas do processo">
            <span aria-hidden="true" className="absolute bottom-6 left-[0.3125rem] top-6 w-px bg-line" />
            <motion.span
              aria-hidden="true"
              className="absolute bottom-6 left-[0.3125rem] top-6 w-px origin-top bg-accent"
              style={{ scaleY: progress }}
            />
            {processSteps.map((s, i) => {
              const isActive = i === active
              const done = i < active
              return (
                <li key={s.id} className="relative">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className="group flex min-h-[5.5rem] w-full items-center gap-6 pl-0 text-left"
                  >
                    <span
                      aria-hidden="true"
                      className={`relative z-[1] size-[11px] border transition-all duration-500 ${
                        isActive ? 'scale-125 border-accent bg-accent' : done ? 'border-accent bg-bg' : 'border-line-strong bg-bg'
                      }`}
                    />
                    <span className={`label-mono w-8 transition-colors ${isActive ? 'text-accent' : 'text-muted'}`}>{s.index}</span>
                    <span
                      className={`text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium tracking-[-0.025em] transition-all duration-500 ${
                        isActive ? 'translate-x-1 text-fg' : 'text-muted group-hover:text-fg'
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>

          {/* Palco: imagem + conteúdo */}
          <div className="col-span-8 grid grid-cols-8 gap-10">
            <div className="registration relative col-span-5 aspect-[4/5] max-h-[68svh] w-full overflow-hidden bg-surface-2">
              <AnimatePresence initial={false}>
                <motion.div
                  key={step.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
                  animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: reduce ? 0.2 : 0.95, ease: EASE_MACHINE }}
                >
                  <motion.div
                    className="h-full w-full"
                    initial={reduce ? false : { scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.4, ease: EASE_PRECISE }}
                  >
                    <SmartImage image={step.image} sizes="36vw" className="h-full w-full" />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
              <span className="scope-dark label-mono absolute bottom-3 left-3 z-[3] bg-[rgb(11_14_17/0.75)] px-2 py-1 text-fg">
                Etapa {step.index} / 0{n}
              </span>
            </div>

            <div className="col-span-3 flex flex-col justify-end" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_PRECISE, delay: reduce ? 0 : 0.2 } }}
                  exit={{ opacity: 0, y: reduce ? 0 : -12, transition: { duration: 0.2 } }}
                >
                  <span className="display block text-[clamp(5rem,8vw,8.5rem)] leading-none text-accent">{step.index}</span>
                  <h3 className="mt-6 text-[1.375rem] font-medium leading-tight tracking-[-0.02em]">{step.lead}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{step.description}</p>
                  <ul className="mt-6 border-t border-line">
                    {step.outputs.map((o) => (
                      <li key={o} className="flex items-center gap-3 border-b border-line py-2.5">
                        <span aria-hidden="true" className="size-1.5 bg-accent" />
                        <span className="text-[0.9375rem]">{o}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileFlow() {
  return (
    <ol className="shell relative mt-14 pb-24 md:pb-36" aria-label="Etapas do processo">
      {processSteps.map((s, i) => (
        <li key={s.id} className="relative grid grid-cols-[2.25rem_1fr] gap-x-4 pb-14 last:pb-0">
          <div className="relative flex flex-col items-center">
            <span className="label-mono flex size-9 items-center justify-center border border-accent text-accent">{s.index}</span>
            {i < processSteps.length - 1 && <TechLine vertical className="mt-2 flex-1 bg-line-strong" />}
          </div>
          <Reveal y={20}>
            <h3 className="display text-[clamp(2rem,8vw,3rem)]">{s.title}</h3>
            <p className="mt-3 text-[1.125rem] font-medium leading-snug">{s.lead}</p>
            <SmartImage image={s.image} sizes="(min-width: 768px) 80vw, 90vw" className="mt-6 aspect-[16/10] w-full" />
            <p className="mt-5 leading-relaxed text-muted">{s.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.outputs.map((o) => (
                <li key={o} className="label-mono border border-line px-2.5 py-1.5">
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
