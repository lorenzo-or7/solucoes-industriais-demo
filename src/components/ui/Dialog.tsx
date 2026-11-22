import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { EASE_PRECISE } from './motion'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  /** drawer: painel lateral · modal: painel central amplo */
  variant?: 'drawer' | 'modal'
  children: ReactNode
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void
  labelledBy?: string
  /** Muda quando o item exibido muda (rola o conteúdo para o topo) */
  contentKey?: string | number | null
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/**
 * Diálogo acessível: foco preso, Esc fecha, foco devolvido ao gatilho, rolagem bloqueada.
 */
export function Dialog({ open, onClose, title, variant = 'drawer', children, onKeyDown, labelledBy, contentKey }: DialogProps) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const fallbackId = useId()
  const titleId = labelledBy ?? fallbackId
  const contentRef = useRef<HTMLDivElement>(null)

  // Ao navegar entre itens dentro do diálogo, volta o conteúdo ao topo.
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 })
  }, [contentKey])

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    const { overflow, paddingRight } = document.body.style
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    const t = window.setTimeout(() => {
      const target = panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panelRef.current
      target?.focus()
    }, 40)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      returnFocus.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key === 'Tab' && panelRef.current) {
      const nodes = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (n) => !n.hasAttribute('disabled') && n.offsetParent !== null,
      )
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    onKeyDown?.(e)
  }

  const isDrawer = variant === 'drawer'
  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : isDrawer
      ? {
          initial: { x: '100%' },
          animate: { x: 0, transition: { duration: 0.7, ease: EASE_PRECISE } },
          exit: { x: '100%', transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] as const } },
        }
      : {
          initial: { opacity: 0, y: 40, clipPath: 'inset(8% 0% 8% 0%)' },
          animate: {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            transition: { duration: 0.75, ease: EASE_PRECISE },
          },
          exit: { opacity: 0, y: 24, transition: { duration: 0.3 } },
        }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" onKeyDown={handleKey}>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-[rgb(var(--scrim)/0.72)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            {...panelMotion}
            className={
              isDrawer
                ? 'absolute inset-y-0 right-0 flex w-full max-w-[44rem] flex-col border-l border-line bg-bg outline-none'
                : 'absolute inset-0 m-auto flex h-full w-full flex-col bg-bg outline-none md:inset-6 md:h-auto md:max-h-[calc(100svh-3rem)] md:max-w-[80rem] md:border md:border-line'
            }
          >
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 md:px-8">
              <span id={labelledBy ? undefined : titleId} className="label-mono truncate text-muted">
                {title}
              </span>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                className="group -mr-2 inline-flex size-11 items-center justify-center text-fg transition-colors hover:text-accent"
                aria-label="Fechar"
              >
                <X className="size-5 transition-transform duration-500 group-hover:rotate-90" strokeWidth={1.5} />
              </button>
            </div>
            <div ref={contentRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
