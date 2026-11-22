import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { solutions, type Solution } from '../content/solutions'
import { useBriefing } from '../hooks/useBriefing'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { SectionHead } from '../components/ui/SectionHead'
import { SmartImage } from '../components/ui/SmartImage'
import { EASE_PRECISE, Reveal } from '../components/ui/motion'

export function Solutions() {
  const [active, setActive] = useState(0)
  const [openId, setOpenId] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState<number | null>(0)
  const pressed = useRef<number | null>(null)

  return (
    <section id="solucoes" aria-labelledby="solucoes-title" className="relative border-t border-line py-24 md:py-36">
      <div className="shell">
        <SectionHead
          index="02"
          label="Industrial Systems"
          titleId="solucoes-title"
          title={['Sistemas para', 'operações exigentes']}
          aside={
            <>
              Seis frentes de atuação que podem ser contratadas isoladamente ou combinadas em um escopo único.
              <span className="mt-4 block label-mono text-muted">Selecione uma solução para ver o detalhamento técnico</span>
            </>
          }
        />

        {/* Desktop — acordeão horizontal */}
        <Reveal className="mt-16 hidden lg:block" y={40}>
          {/* Os painéis mudam de largura durante o hover: se o botão do mouse for solto sobre outro painel,
              o clique cai no <ul>. Guardamos o painel pressionado para abrir o correto. */}
          <ul
            className="flex h-[min(42rem,78vh)] gap-px border border-line bg-line"
            aria-label="Catálogo de soluções"
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest('button') && pressed.current !== null) setOpenId(pressed.current)
              pressed.current = null
            }}
          >
            {solutions.map((s, i) => (
              <DesktopPanel
                key={s.id}
                solution={s}
                index={i}
                active={active === i}
                onActivate={() => setActive(i)}
                onPress={() => {
                  pressed.current = i
                }}
                onOpen={() => {
                  pressed.current = null
                  setOpenId(i)
                }}
              />
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between text-muted">
            <span className="label-mono">
              <span className="text-fg">{String(active + 1).padStart(2, '0')}</span> / {String(solutions.length).padStart(2, '0')} — {solutions[active].title}
            </span>
            <span className="label-mono">Clique para abrir a ficha técnica</span>
          </div>
        </Reveal>

        {/* Mobile e tablet — acordeão vertical por toque */}
        <ul className="mt-14 border-t border-line lg:hidden" aria-label="Catálogo de soluções">
          {solutions.map((s, i) => (
            <MobileRow
              key={s.id}
              solution={s}
              open={mobileOpen === i}
              onToggle={() => setMobileOpen((cur) => (cur === i ? null : i))}
              onOpen={() => setOpenId(i)}
            />
          ))}
        </ul>
      </div>

      <SolutionDrawer index={openId} onClose={() => setOpenId(null)} onNavigate={setOpenId} />
    </section>
  )
}

function DesktopPanel({
  solution,
  index,
  active,
  onActivate,
  onPress,
  onOpen,
}: {
  solution: Solution
  index: number
  active: boolean
  onActivate: () => void
  onPress: () => void
  onOpen: () => void
}) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      className="relative min-w-0 overflow-hidden bg-bg"
      animate={{ flexGrow: active ? 5.2 : 1 }}
      initial={false}
      transition={{ duration: reduce ? 0 : 0.85, ease: EASE_PRECISE }}
      style={{ flexBasis: 0 }}
      onMouseEnter={onActivate}
    >
      <button
        type="button"
        onFocus={onActivate}
        onPointerDown={onPress}
        onClick={onOpen}
        aria-label={`${solution.title}: ${solution.summary} Abrir ficha técnica.`}
        className="scope-dark group absolute inset-0 block h-full w-full overflow-hidden text-left text-fg"
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: active ? 1 : 1.18, filter: active ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.55)' }}
          initial={false}
          transition={{ duration: reduce ? 0 : 1.1, ease: EASE_PRECISE }}
        >
          <SmartImage image={solution.image} sizes="60vw" className="h-full w-full" decorative />
        </motion.div>
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-80'} bg-[linear-gradient(to_top,rgb(11_14_17/0.92)_0%,rgb(11_14_17/0.35)_55%,rgb(11_14_17/0.2)_100%)]`}
        />

        {/* Cabeçalho do painel */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
          <span className={`label-mono whitespace-nowrap transition-colors ${active ? 'text-accent' : 'text-muted'}`}>{solution.code}</span>
          {active && (
            <span className="label-mono whitespace-nowrap text-muted">
              {String(index + 1).padStart(2, '0')} / {String(solutions.length).padStart(2, '0')}
            </span>
          )}
        </div>

        {/* Título vertical (estado recolhido) */}
        <span
          aria-hidden="true"
          className={`absolute bottom-6 left-1/2 origin-bottom-left translate-x-[0.6rem] -rotate-90 whitespace-nowrap text-[1.25rem] font-medium tracking-[-0.01em] transition-opacity duration-500 ${
            active ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {solution.title}
        </span>

        {/* Conteúdo expandido — revelação de informações técnicas */}
        <AnimatePresence>
          {active && (
            <motion.div
              className="absolute bottom-0 left-0 flex w-[calc((min(100vw,92rem)-7rem)*0.5)] flex-col gap-5 p-7 xl:p-9"
              initial={{ opacity: 0, y: reduce ? 0 : 26 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_PRECISE, delay: reduce ? 0 : 0.28 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <h3 className="display max-w-[22ch] text-[clamp(2rem,3.2vw,3.25rem)] leading-[0.95]">{solution.title}</h3>
              <p className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-muted">{solution.summary}</p>
              <ul className="flex max-w-[40rem] flex-wrap gap-2" aria-label="Escopo técnico">
                {solution.specs.map((spec) => (
                  <li key={spec} className="label-mono border border-line px-2.5 py-1.5 text-fg">
                    {spec}
                  </li>
                ))}
              </ul>
              <span className="mt-1 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-fg">
                <span className="border-b border-accent pb-0.5">Ver ficha técnica</span>
                <ArrowUpRight aria-hidden="true" className="size-4 text-accent transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.li>
  )
}

function MobileRow({
  solution,
  open,
  onToggle,
  onOpen,
}: {
  solution: Solution
  open: boolean
  onToggle: () => void
  onOpen: () => void
}) {
  const reduce = useReducedMotion()
  const panelId = `sol-panel-${solution.id}`
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[4.75rem] w-full items-center gap-4 py-4 text-left"
        >
          <span className={`label-mono w-14 shrink-0 ${open ? 'text-accent' : 'text-muted'}`}>{solution.code}</span>
          <span className="flex-1 text-[clamp(1.25rem,4.6vw,1.75rem)] font-medium leading-tight tracking-[-0.02em]">
            {solution.title}
          </span>
          <Plus
            aria-hidden="true"
            className={`size-5 shrink-0 transition-transform duration-500 ${open ? 'rotate-45 text-accent' : ''}`}
            strokeWidth={1.5}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={solution.title}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, ease: EASE_PRECISE }}
          >
            <div className="grid gap-5 pb-8 sm:grid-cols-2 sm:gap-6">
              <SmartImage image={solution.image} sizes="(min-width: 640px) 50vw, 100vw" className="aspect-[16/10] w-full" />
              <div className="flex flex-col gap-4">
                <p className="leading-relaxed text-muted">{solution.summary}</p>
                <ul className="flex flex-wrap gap-2" aria-label="Escopo técnico">
                  {solution.specs.map((spec) => (
                    <li key={spec} className="label-mono border border-line px-2.5 py-1.5">
                      {spec}
                    </li>
                  ))}
                </ul>
                <Button variant="ghost" magnetic={false} onClick={onOpen} className="mt-auto self-start">
                  Ver ficha técnica
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

function SolutionDrawer({
  index,
  onClose,
  onNavigate,
}: {
  index: number | null
  onClose: () => void
  onNavigate: (i: number) => void
}) {
  const { requestProposal } = useBriefing()
  const reduce = useReducedMotion()
  const solution = index !== null ? solutions[index] : null
  const total = solutions.length
  const go = (dir: 1 | -1) => index !== null && onNavigate((index + dir + total) % total)

  return (
    <Dialog
      open={index !== null}
      onClose={onClose}
      title={solution ? `Ficha técnica — ${solution.code}` : 'Ficha técnica'}
      labelledBy="solution-drawer-title"
      contentKey={index}
      onKeyDown={(e) => {
        if ((e.target as HTMLElement).closest('button, a') === null) {
          if (e.key === 'ArrowRight') go(1)
          if (e.key === 'ArrowLeft') go(-1)
        }
      }}
    >
      {solution && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={solution.id}
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -24 }}
            transition={{ duration: 0.4, ease: EASE_PRECISE }}
          >
            <SmartImage image={solution.image} sizes="(min-width: 768px) 44rem, 100vw" className="aspect-[16/9] w-full" />
            <div className="px-5 py-8 md:px-8 md:py-10">
              <p className="label-mono text-accent">{solution.code} · Solução demonstrativa</p>
              <h3 id="solution-drawer-title" className="display mt-4 text-[clamp(2.2rem,5vw,3.5rem)]">
                {solution.title}
              </h3>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-muted">{solution.description}</p>

              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                <DetailList title="Aplicações" items={solution.applications} />
                <DetailList title="Benefícios" items={solution.benefits} />
              </div>

              <div className="mt-10 border-t border-line pt-6">
                <p className="label-mono text-muted">Escopo técnico</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {solution.specs.map((spec) => (
                    <li key={spec} className="label-mono border border-line px-2.5 py-1.5">
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 flex flex-col gap-6 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  magnetic={false}
                  onClick={() => {
                    onClose()
                    window.setTimeout(() => requestProposal(solution.id), 320)
                  }}
                >
                  Solicitar proposta para esta solução
                </Button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-fg"
                    aria-label="Solução anterior"
                  >
                    <ArrowLeft aria-hidden="true" className="size-4" />
                  </button>
                  <span className="label-mono w-14 text-center text-muted">
                    {String((index ?? 0) + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-fg"
                    aria-label="Próxima solução"
                  >
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      )}
    </Dialog>
  )
}

export function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="label-mono text-muted">{title}</h4>
      <ul className="mt-4 border-t border-line">
        {items.map((item, i) => (
          <li key={item} className="grid grid-cols-[2rem_1fr] gap-2 border-b border-line py-3 leading-snug">
            <span className="label-mono pt-0.5 text-accent">{String(i + 1).padStart(2, '0')}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
