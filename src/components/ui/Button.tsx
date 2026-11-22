import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Magnetic } from './motion'

type Variant = 'primary' | 'ghost' | 'line'

const base =
  'group/btn relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-[background-color,color,border-color] duration-300 disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink hover:bg-fg hover:text-bg',
  ghost: 'border border-line-strong text-fg hover:border-fg',
  line: 'px-0 text-fg underline-offset-8 hover:text-accent',
}

interface ButtonContentProps {
  children: ReactNode
  icon?: ReactNode | false
}

function Content({ children, icon }: ButtonContentProps) {
  return (
    <>
      {/* Microinteração: rótulo desliza verticalmente (troca por duplicata) */}
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-precise)] group-hover/btn:-translate-y-full motion-reduce:transition-none">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-precise)] group-hover/btn:translate-y-0 motion-reduce:transition-none"
        >
          {children}
        </span>
      </span>
      {icon !== false && (
        <span aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-precise)] group-hover/btn:rotate-45">
          {icon ?? <ArrowUpRight className="size-4" strokeWidth={1.75} />}
        </span>
      )}
    </>
  )
}

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: Variant
  icon?: ReactNode | false
  magnetic?: boolean
}

export function Button({ variant = 'primary', icon, magnetic = true, className = '', children, type = 'button', ...rest }: ButtonProps) {
  const el = (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Content icon={icon}>{children}</Content>
    </button>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

type LinkButtonProps = ComponentPropsWithoutRef<'a'> & {
  variant?: Variant
  icon?: ReactNode | false
  magnetic?: boolean
}

export function LinkButton({ variant = 'primary', icon, magnetic = true, className = '', children, ...rest }: LinkButtonProps) {
  const el = (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Content icon={icon}>{children}</Content>
    </a>
  )
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
