import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'claro' : 'escuro'

  return (
    <button
      type="button"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      aria-label={`Ativar tema ${next}`}
      title={`Ativar tema ${next}`}
      className={`relative inline-flex size-11 items-center justify-center overflow-hidden border border-line text-fg transition-colors duration-300 hover:border-fg ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          {theme === 'dark' ? (
            <Sun aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
          ) : (
            <Moon aria-hidden="true" className="size-[18px]" strokeWidth={1.5} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
