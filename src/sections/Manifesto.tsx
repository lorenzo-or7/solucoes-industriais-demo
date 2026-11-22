import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { useRef } from 'react'
import { media } from '../content/media'
import { SmartImage } from '../components/ui/SmartImage'
import { MaskLines, Reveal, TechLine } from '../components/ui/motion'

const TEXT =
  'Cada operação exige precisão. Cada desafio pede inteligência. Transformamos necessidades industriais em soluções que conectam engenharia, tecnologia e desempenho.'

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.24, 1])
  return (
    <motion.span style={{ opacity }} className="inline">
      {children}{' '}
    </motion.span>
  )
}

/** Scroll-Linked Storytelling: palavras ganham opacidade conforme a leitura avança. */
function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.55'] })
  const words = text.split(' ')

  if (reduce) return <p className={className}>{text}</p>

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]}>
            {w}
          </Word>
        ))}
      </span>
    </p>
  )
}

export function Manifesto() {
  const reduce = useReducedMotion()
  const imageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: imageRef, offset: ['start end', 'end start'] })
  // Image Reveal: máscara abre de baixo para cima durante a entrada
  const clip = useTransform(scrollYProgress, [0.05, 0.45], ['inset(38% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative py-24 md:py-36">
      <div className="shell">
        <div className="flex items-center gap-4 text-muted">
          <span className="label-mono text-accent">01</span>
          <TechLine className="flex-1" />
          <span className="label-mono">Manifesto</span>
        </div>

        <MaskLines
          as="h2"
          id="manifesto-title"
          className="display mt-12 text-[clamp(2.6rem,8.4vw,8.6rem)] md:mt-16"
          lines={[
            'O complexo',
            <span key="l2" className="inline-block md:pl-[16%]">é o nosso</span>,
            <span key="l3" className="inline-block md:pl-[33%]">
              ponto de partida<span className="text-accent">.</span>
            </span>,
          ]}
        />

        <div className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div ref={imageRef} className="relative lg:col-span-7">
            <motion.div
              className="registration relative aspect-[4/5] overflow-hidden sm:aspect-[16/11]"
              style={reduce ? undefined : { clipPath: clip }}
            >
              <motion.div className="absolute -inset-y-[10%] inset-x-0" style={reduce ? undefined : { y: imgY }}>
                <SmartImage image={media.manifestoPlant} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full" />
              </motion.div>
            </motion.div>
            <div className="mt-3 flex justify-between gap-4 text-muted">
              <span className="label-mono">Fig. 01 — Planta industrial</span>
              <span className="label-mono hidden sm:inline">Built for complexity</span>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-12 lg:col-span-5 lg:pt-24">
            <ScrollText
              text={TEXT}
              className="text-[clamp(1.375rem,2.3vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-fg"
            />
            <Reveal>
              <dl className="border-t border-line">
                {[
                  ['Engenharia', 'Método e base técnica em cada decisão'],
                  ['Tecnologia', 'Automação e dados a serviço da operação'],
                  ['Desempenho', 'Resultados avaliados no chão de fábrica'],
                ].map(([term, desc], i) => (
                  <div key={term} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-line py-4 sm:grid-cols-[3rem_9rem_1fr]">
                    <span className="label-mono pt-1 text-accent">0{i + 1}</span>
                    <dt className="font-medium">{term}</dt>
                    <dd className="col-start-2 text-muted sm:col-start-3">{desc}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
