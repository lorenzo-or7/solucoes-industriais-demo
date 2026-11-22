import type { ReactNode } from 'react'
import { MaskLines, Reveal, TechLine } from './motion'

interface SectionHeadProps {
  index: string
  label: string
  title: ReactNode[]
  titleId: string
  aside?: ReactNode
  className?: string
}

/**
 * Cabeçalho editorial de seção: numeração, rótulo técnico, título monumental e nota lateral.
 */
export function SectionHead({ index, label, title, titleId, aside, className = '' }: SectionHeadProps) {
  return (
    <header className={className}>
      <div className="flex items-center gap-4 text-muted">
        <span className="label-mono text-accent">{index}</span>
        <TechLine className="flex-1" />
        <span className="label-mono">{label}</span>
      </div>
      <div className="mt-10 grid gap-8 md:mt-14 lg:grid-cols-12 lg:items-end">
        <MaskLines
          as="h2"
          id={titleId}
          lines={title}
          className="display text-[clamp(2.4rem,6.6vw,6.4rem)] lg:col-span-8"
        />
        {aside && (
          <Reveal delay={0.2} className="text-[1.0625rem] leading-relaxed text-muted lg:col-span-4 lg:pb-2">
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  )
}
