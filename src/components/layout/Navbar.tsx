import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { navItems } from '../../content/site'
import { useActiveSection } from '../../hooks/useActiveSection'
import { scrollToSection } from '../../lib/scroll'
import { useBriefing } from '../../hooks/useBriefing'
import { Button } from '../ui/Button'
import { EASE_PRECISE } from '../ui/motion'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const sectionIds = navItems.map((n) => n.id)

export function Navbar() {
  const { scrollY } = useScroll()
  const [overHero, setOverHero] = useState(() => window.scrollY < window.innerHeight - 90)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(sectionIds)
  const { requestProposal } = useBriefing()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const heroH = document.getElementById('inicio')?.offsetHeight ?? window.innerHeight
    setOverHero(y < heroH - 90)
  })

  const transparent = overHero && !menuOpen

  return (
    <>
      <a
        href="#conteudo"
        className="label-mono fixed left-4 top-4 z-[100] -translate-y-24 bg-accent px-4 py-3 text-accent-ink transition-transform focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <header className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 md:px-5 md:pt-4">
        <motion.nav
          aria-label="Principal"
          className={`mx-auto flex h-16 max-w-[92rem] items-center justify-between gap-4 border pl-4 pr-2 transition-[background-color,border-color,backdrop-filter] duration-500 md:pl-6 ${
            transparent
              ? 'scope-dark border-transparent bg-transparent'
              : 'border-line bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-xl'
          }`}
        >
          <a href="#inicio" className="flex min-h-11 items-center" aria-label="AXIOM Industrial — início">
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`group/link relative flex h-11 items-center px-3.5 text-[0.9375rem] transition-colors duration-300 ${
                      isActive ? 'text-fg' : 'text-muted hover:text-fg'
                    }`}
                  >
                    <span className="relative block overflow-hidden">
                      <span className="block transition-transform duration-500 ease-[var(--ease-precise)] group-hover/link:-translate-y-full motion-reduce:transition-none">
                        {item.label}
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 translate-y-full transition-transform duration-500 ease-[var(--ease-precise)] group-hover/link:translate-y-0 motion-reduce:transition-none"
                      >
                        {item.label}
                      </span>
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3.5 bottom-2 h-px bg-accent"
                        transition={{ duration: 0.5, ease: EASE_PRECISE }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden md:inline-flex">
              <Button onClick={() => requestProposal()}>Solicitar proposta</Button>
            </span>
            <MenuButton open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
          </div>
        </motion.nav>
      </header>

      <MobileMenu
        open={menuOpen}
        active={active}
        onClose={() => setMenuOpen(false)}
        onPropose={() => {
          setMenuOpen(false)
          requestProposal()
        }}
      />
    </>
  )
}

function MenuButton({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="menu-mobile"
      aria-label={open ? 'Fechar menu' : 'Abrir menu'}
      className="relative inline-flex size-11 items-center justify-center border border-line text-fg lg:hidden"
    >
      <span aria-hidden="true" className="relative block h-3 w-5">
        <span
          className={`absolute left-0 h-px w-5 bg-current transition-transform duration-500 ease-[var(--ease-precise)] ${
            open ? 'top-1.5 rotate-45' : 'top-0'
          }`}
        />
        <span
          className={`absolute left-0 h-px bg-current transition-all duration-500 ease-[var(--ease-precise)] ${
            open ? 'top-1.5 w-5 -rotate-45' : 'top-3 w-3'
          }`}
        />
      </span>
    </button>
  )
}

interface MobileMenuProps {
  open: boolean
  active: string | null
  onClose: () => void
  onPropose: () => void
}

function MobileMenu({ open, active, onClose, onPropose }: MobileMenuProps) {
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus(), 120)
    const onResize = () => window.innerWidth >= 1024 && onClose()
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(t)
      document.body.style.overflow = prev
      window.removeEventListener('resize', onResize)
    }
  }, [open, onClose])

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose()
      document.querySelector<HTMLElement>('[aria-controls="menu-mobile"]')?.focus()
    }
    if (e.key === 'Tab' && panelRef.current) {
      // Inclui o botão de fechar do header no ciclo de foco.
      const toggleBtn = document.querySelector<HTMLElement>('[aria-controls="menu-mobile"]')
      const nodes = [toggleBtn, ...panelRef.current.querySelectorAll<HTMLElement>('a, button')].filter(
        (n): n is HTMLElement => Boolean(n),
      )
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
  }

  // Esc fecha o menu mesmo quando o foco está nos controles do header.
  useEffect(() => {
    if (!open) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[65] flex flex-col bg-bg px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-28 lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={reduce ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <nav aria-label="Menu móvel" className="flex-1 overflow-y-auto">
            <ul className="border-t border-line">
              {navItems.map((item, i) => (
                <li key={item.id} className="overflow-hidden border-b border-line">
                  <motion.a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      // O menu bloqueia a rolagem do body; fecha primeiro e rola em seguida.
                      e.preventDefault()
                      onClose()
                      window.setTimeout(() => scrollToSection(item.id), 60)
                    }}
                    aria-current={active === item.id ? 'location' : undefined}
                    className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3 text-fg"
                    initial={reduce ? { opacity: 0 } : { y: '100%' }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    exit={reduce ? { opacity: 0 } : { y: '-100%' }}
                    transition={{ duration: 0.7, ease: EASE_PRECISE, delay: reduce ? 0 : 0.18 + i * 0.06 }}
                  >
                    <span className="display text-[clamp(2rem,9vw,3.25rem)]">{item.label}</span>
                    <span className={`label-mono ${active === item.id ? 'text-accent' : 'text-muted'}`}>
                      0{i + 1}
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
          <motion.div
            className="mt-6 flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: reduce ? 0 : 0.55 } }}
            exit={{ opacity: 0 }}
          >
            <Button onClick={onPropose} magnetic={false} className="w-full justify-between">
              Solicitar proposta
            </Button>
            <p className="label-mono text-muted">AXIOM Industrial · Protótipo demonstrativo</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
