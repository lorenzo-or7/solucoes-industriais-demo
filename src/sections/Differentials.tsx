import { motion, useReducedMotion } from 'motion/react'
import { differentials } from '../content/site'
import { EASE_MACHINE, EASE_PRECISE, MaskLines, Reveal, TechLine } from '../components/ui/motion'

export function Differentials() {
  const reduce = useReducedMotion()
  return (
    <section id="diferenciais" aria-labelledby="diferenciais-title" className="relative border-t border-line py-24 md:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <div className="flex items-center gap-4 text-muted">
              <span className="label-mono text-accent">06</span>
              <TechLine className="flex-1" />
            </div>
            <p className="label-mono mt-4 text-muted">Precision in Every Detail</p>
            <MaskLines
              as="h2"
              id="diferenciais-title"
              lines={['Precisão', 'em cada', 'detalhe']}
              className="display mt-8 text-[clamp(2.6rem,5.6vw,5.4rem)]"
            />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[34ch] text-[1.0625rem] leading-relaxed text-muted">
                O que orienta a forma de trabalhar da AXIOM — em qualquer porte de escopo.
              </p>
            </Reveal>
          </div>
        </div>

        <ol className="lg:col-span-7 lg:col-start-6">
          {differentials.map((d, i) => {
            const even = i % 2 === 1
            return (
              <motion.li
                key={d.title}
                className={`group relative grid grid-cols-[3.5rem_1fr] gap-x-5 py-8 sm:grid-cols-[5.5rem_1fr] md:py-10 ${
                  even ? 'lg:ml-[14%]' : ''
                }`}
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -12% 0px' }}
                transition={{ duration: 0.8, ease: EASE_PRECISE }}
              >
                <TechLine className="absolute inset-x-0 top-0" />
                {/* marcador de tolerância */}
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-[3px] w-16 origin-left bg-accent"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: reduce ? 0 : 0.9, ease: EASE_MACHINE, delay: 0.3 }}
                />
                <span
                  className={`font-mono text-[clamp(2rem,4vw,3.25rem)] leading-none tracking-[-0.04em] ${
                    even ? 'text-accent' : 'text-muted'
                  }`}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-[1.1] tracking-[-0.025em] transition-transform duration-500 group-hover:translate-x-1">
                    {d.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] leading-relaxed text-muted">{d.text}</p>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
