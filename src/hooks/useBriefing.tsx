import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SolutionId } from '../content/solutions'
import { scrollToSection } from '../lib/scroll'

export type BriefingSolution = SolutionId | 'outro'

interface BriefingContextValue {
  solution: BriefingSolution | null
  setSolution: (id: BriefingSolution | null) => void
  /** Pré-seleciona uma solução no formulário e rola até o contato. */
  requestProposal: (id?: BriefingSolution) => void
}

const BriefingContext = createContext<BriefingContextValue | null>(null)

export function BriefingProvider({ children }: { children: ReactNode }) {
  const [solution, setSolution] = useState<BriefingSolution | null>(null)

  const requestProposal = useCallback((id?: BriefingSolution) => {
    if (id) setSolution(id)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollToSection('contato')
    // Move o foco para o primeiro campo depois da rolagem, sem saltar a tela.
    window.setTimeout(() => {
      document.getElementById('field-nome')?.focus({ preventScroll: true })
    }, reduce ? 0 : 700)
  }, [])

  const value = useMemo(() => ({ solution, setSolution, requestProposal }), [solution, requestProposal])
  return <BriefingContext.Provider value={value}>{children}</BriefingContext.Provider>
}

export function useBriefing() {
  const ctx = useContext(BriefingContext)
  if (!ctx) throw new Error('useBriefing precisa estar dentro de BriefingProvider')
  return ctx
}
