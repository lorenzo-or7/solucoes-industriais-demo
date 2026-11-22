import { ArrowUp } from 'lucide-react'
import { heroVideo, media } from '../../content/media'
import { navItems, whatsappNumber } from '../../content/site'
import { solutions } from '../../content/solutions'
import { useBriefing } from '../../hooks/useBriefing'
import { Reveal, TechLine } from '../ui/motion'

const credits = Object.values(media)

export function Footer() {
  const { requestProposal } = useBriefing()
  return (
    <footer className="relative overflow-hidden border-t border-line pt-20 md:pt-28" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Rodapé
      </h2>
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-[30ch] text-[1.375rem] font-medium leading-snug tracking-[-0.02em]">
              Engenharia, tecnologia e execução para operações industriais exigentes.
            </p>
            <button
              type="button"
              onClick={() => requestProposal()}
              className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-accent pb-1 text-[0.9375rem] font-medium transition-colors hover:text-accent"
            >
              Solicitar proposta
            </button>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-2">
            <h3 className="label-mono text-muted">Navegação</h3>
            <ul className="mt-4 space-y-1">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="inline-flex min-h-9 items-center transition-colors hover:text-accent">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h3 className="label-mono text-muted">Soluções</h3>
            <ul className="mt-4 space-y-1">
              {solutions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => requestProposal(s.id)}
                    className="inline-flex min-h-9 items-center text-left transition-colors hover:text-accent"
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="label-mono text-muted">Contato</h3>
            <ul className="mt-4 space-y-3 text-muted">
              <li>
                <a href="#contato" className="text-fg transition-colors hover:text-accent">
                  Formulário de briefing
                </a>
              </li>
              <li className="text-[0.9375rem] leading-snug">
                WhatsApp: {whatsappNumber ? 'canal configurado' : 'canal a configurar'}
              </li>
              <li className="text-[0.9375rem] leading-snug">Endereço e dados legais definidos pela empresa contratante.</li>
            </ul>
          </div>
        </div>

        <TechLine className="mt-20" />

        {/* Assinatura monumental */}
        <Reveal y={60}>
          <p aria-hidden="true" className="display select-none py-6 text-center text-[clamp(5rem,24vw,22rem)] leading-[0.8] tracking-[-0.06em] text-fg">
            AXI<span className="text-accent">O</span>M
          </p>
        </Reveal>

        <div className="flex flex-col gap-6 border-t border-line py-8 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2 text-[0.875rem] text-muted">
            <p>
              <strong className="font-medium text-fg">AXIOM Industrial</strong> é uma marca fictícia, criada para fins de
              demonstração. Os cenários apresentados são ilustrativos.
            </p>
            <p>
              Design e desenvolvimento <strong className="font-medium text-fg">Or7.dev</strong> — protótipo comercial.
            </p>
            <details className="group pt-2">
              <summary className="label-mono inline-flex min-h-9 cursor-pointer list-none items-center gap-2 text-muted transition-colors hover:text-fg">
                <span className="transition-transform group-open:rotate-45">+</span> Créditos de imagem
              </summary>
              <ul className="mt-3 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                <li>
                  <a href={heroVideo.source} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-fg hover:underline">
                    Vídeo: {heroVideo.credit} / Pexels
                  </a>
                </li>
                {credits.map((c) => (
                  <li key={c.key}>
                    <a href={c.source} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-fg hover:underline">
                      {c.alt} / {c.provider}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          <a
            href="#inicio"
            className="group inline-flex min-h-11 shrink-0 items-center gap-3 self-start border border-line px-4 transition-colors hover:border-fg"
          >
            <span className="label-mono">Voltar ao topo</span>
            <ArrowUp aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}
