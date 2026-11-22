import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'motion/react'
import { useRef, type ReactNode, type PointerEvent } from 'react'

export const EASE_PRECISE = [0.22, 1, 0.36, 1] as const
export const EASE_MACHINE = [0.65, 0, 0.35, 1] as const

/* ── Text Mask Reveal ─────────────────────────────────────────── */
interface MaskLinesProps {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  /** Anima ao montar (hero) em vez de ao entrar na viewport. */
  immediate?: boolean
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
}

export function MaskLines({
  lines,
  className = '',
  lineClassName = '',
  immediate = false,
  delay = 0,
  as = 'h2',
  id,
}: MaskLinesProps) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  const trigger = immediate
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '0px 0px -12% 0px' } }

  return (
    <Tag id={id} className={className} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.06em] -mb-[0.06em] ${lineClassName}`}>
          <motion.span
            className="block will-change-transform"
            variants={{
              hidden: reduce ? { opacity: 0 } : { y: '108%' },
              visible: reduce
                ? { opacity: 1, transition: { duration: 0.3, delay: delay + i * 0.05 } }
                : { y: '0%', transition: { duration: 1.05, ease: EASE_PRECISE, delay: delay + i * 0.09 } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ── Section enter choreography ───────────────────────────────── */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: reduce ? 0.3 : 0.9, ease: EASE_PRECISE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/* ── Animated Technical Line ──────────────────────────────────── */
export function TechLine({
  className = '',
  delay = 0,
  vertical = false,
}: {
  className?: string
  delay?: number
  vertical?: boolean
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden="true"
      className={`${vertical ? 'w-px origin-top' : 'h-px origin-left'} bg-line ${className}`}
      initial={reduce ? { opacity: 0 } : vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={reduce ? { opacity: 1 } : vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: reduce ? 0.3 : 1.4, ease: EASE_MACHINE, delay }}
    />
  )
}

/* ── Magnetic microinteraction ────────────────────────────────── */
export function Magnetic({ children, strength = 0.22, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  const onMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(Math.max(-8, Math.min(8, dx * strength)))
    y.set(Math.max(-6, Math.min(6, dy * strength)))
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
