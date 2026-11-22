import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AlertCircle, Check, Copy, ExternalLink, MessageSquare, RotateCcw } from 'lucide-react'
import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { media } from '../content/media'
import { whatsappNumber } from '../content/site'
import { solutions } from '../content/solutions'
import {
  buildBriefing,
  copyText,
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  validate,
  whatsappUrl,
  type BriefingData,
} from '../lib/briefing'
import { useBriefing, type BriefingSolution } from '../hooks/useBriefing'
import { Button } from '../components/ui/Button'
import { SmartImage } from '../components/ui/SmartImage'
import { EASE_PRECISE, MaskLines, Reveal, TechLine } from '../components/ui/motion'

type Phase = 'form' | 'handoff' | 'unconfigured'
type CopyState = 'idle' | 'copying' | 'copied' | 'failed'

const solutionOptions: { id: BriefingSolution; label: string }[] = [
  ...solutions.map((s) => ({ id: s.id as BriefingSolution, label: s.title })),
  { id: 'outro', label: 'Outro / ainda não sei' },
]

export function Contact() {
  const reduce = useReducedMotion()
  const { solution, setSolution } = useBriefing()
  const [fields, setFields] = useState({ nome: '', empresa: '', email: '', descricao: '' })
  const [touched, setTouched] = useState<Partial<Record<keyof BriefingData, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [phase, setPhase] = useState<Phase>('form')
  const [message, setMessage] = useState('')
  const [popupBlocked, setPopupBlocked] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const data: BriefingData = { ...fields, solucao: solution }
  const errors = validate(data)
  const visibleError = (k: keyof BriefingData) => ((submitted || touched[k]) && errors[k]) || undefined
  const errorCount = Object.keys(errors).length

  const update = (k: keyof typeof fields) => (v: string) => setFields((f) => ({ ...f, [k]: v }))
  const blur = (k: keyof BriefingData) => () => setTouched((t) => ({ ...t, [k]: true }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (errorCount > 0) {
      const order: (keyof BriefingData)[] = ['nome', 'empresa', 'email', 'solucao', 'descricao']
      const first = order.find((k) => errors[k])
      const el = first === 'solucao' ? formRef.current?.querySelector<HTMLElement>('input[name="solucao"]') : document.getElementById(`field-${first}`)
      el?.focus()
      return
    }
    const text = buildBriefing(data)
    setMessage(text)
    setCopyState('idle')
    if (whatsappNumber) {
      // Sem a flag "noopener" para conseguir detectar bloqueio de pop-up; o opener é anulado em seguida.
      const win = window.open(whatsappUrl(whatsappNumber, text), '_blank')
      if (win) win.opener = null
      setPopupBlocked(!win)
      setPhase('handoff')
    } else {
      setPhase('unconfigured')
    }
  }

  const onCopy = async () => {
    setCopyState('copying')
    const ok = await copyText(message)
    setCopyState(ok ? 'copied' : 'failed')
  }

  const reset = () => {
    setFields({ nome: '', empresa: '', email: '', descricao: '' })
    setSolution(null)
    setTouched({})
    setSubmitted(false)
    setPhase('form')
    setCopyState('idle')
    window.setTimeout(() => document.getElementById('field-nome')?.focus(), 80)
  }

  const backToEdit = () => {
    setPhase('form')
    setCopyState('idle')
    window.setTimeout(() => document.getElementById('field-nome')?.focus(), 80)
  }

  return (
    <section id="contato" aria-labelledby="contato-title" className="relative border-t border-line bg-surface">
      <div className="shell grid gap-16 py-24 md:py-36 lg:grid-cols-12 lg:gap-10">
        {/* Coluna editorial */}
        <div className="lg:col-span-5">
          <div className="flex items-center gap-4 text-muted">
            <span className="label-mono text-accent">07</span>
            <TechLine className="flex-1" />
            <span className="label-mono">Start a Project</span>
          </div>
          <MaskLines
            as="h2"
            id="contato-title"
            lines={['O próximo', 'avanço começa', <>aqui<span className="text-accent">.</span></>]}
            className="display mt-10 text-[clamp(2.6rem,6vw,5.6rem)]"
          />
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-[38ch] text-[1.125rem] leading-relaxed text-muted">
              Conte o desafio da sua operação. Vamos explorar a solução ideal.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-12">
            <h3 className="label-mono text-fg">Como funciona</h3>
            <ol className="mt-4 border-t border-line">
              {[
                'Preencha o briefing com o contexto do desafio.',
                whatsappNumber
                  ? 'O briefing estruturado abre no WhatsApp, pronto para você enviar.'
                  : 'O briefing estruturado é gerado para você revisar e copiar.',
                'A equipe técnica analisa e retorna pelo canal informado.',
              ].map((t, i) => (
                <li key={i} className="grid grid-cols-[2.5rem_1fr] border-b border-line py-3.5">
                  <span className="label-mono pt-0.5 text-accent">0{i + 1}</span>
                  <span className="leading-snug">{t}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-center gap-2.5 label-mono text-muted">
              <span
                aria-hidden="true"
                className={`size-2 ${whatsappNumber ? 'bg-success' : 'bg-accent'}`}
              />
              Canal WhatsApp: {whatsappNumber ? 'configurado' : 'não configurado nesta demonstração'}
            </p>
          </Reveal>

          <Reveal delay={0.25} className="mt-12 hidden lg:block">
            <SmartImage image={media.contactPlant} sizes="36vw" className="registration aspect-[16/9] w-full" />
          </Reveal>
        </div>

        {/* Formulário / resultado */}
        <div className="lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait" initial={false}>
            {phase === 'form' ? (
              <motion.form
                key="form"
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                aria-labelledby="briefing-title"
                className="border border-line bg-bg p-5 sm:p-8 xl:p-10"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                transition={{ duration: 0.45, ease: EASE_PRECISE }}
              >
                <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
                  <h3 id="briefing-title" className="label-mono text-fg">
                    Briefing de projeto
                  </h3>
                  <span className="label-mono text-muted">Campos obrigatórios</span>
                </div>

                <AnimatePresence>
                  {submitted && errorCount > 0 && (
                    <motion.div
                      role="alert"
                      className="mt-6 flex items-start gap-3 border border-danger px-4 py-3 text-danger"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      <span className="text-[0.9375rem]">
                        {errorCount === 1 ? 'Revise 1 campo destacado.' : `Revise ${errorCount} campos destacados.`}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 grid gap-x-6 gap-y-7 md:grid-cols-2">
                  <TextField id="field-nome" label="Nome" autoComplete="name" value={fields.nome} onChange={update('nome')} onBlur={blur('nome')} error={visibleError('nome')} />
                  <TextField id="field-empresa" label="Empresa" autoComplete="organization" value={fields.empresa} onChange={update('empresa')} onBlur={blur('empresa')} error={visibleError('empresa')} />
                  <TextField
                    id="field-email"
                    label="E-mail"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={fields.email}
                    onChange={update('email')}
                    onBlur={blur('email')}
                    error={visibleError('email')}
                    className="md:col-span-2"
                  />
                </div>

                <fieldset className="mt-8" aria-describedby={visibleError('solucao') ? 'err-solucao' : undefined}>
                  <legend className="label-mono text-muted">Tipo de solução</legend>
                  <div className="mt-3 grid gap-px border border-line bg-line sm:grid-cols-2">
                    {solutionOptions.map((opt) => {
                      const checked = solution === opt.id
                      return (
                        <label
                          key={opt.id}
                          className={`relative flex min-h-12 cursor-pointer items-center gap-3 px-4 py-3 text-[0.9375rem] transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-accent ${
                            checked ? 'bg-accent-soft text-fg' : 'bg-bg text-muted hover:bg-surface hover:text-fg'
                          } ${opt.id === 'outro' ? 'sm:col-span-2' : ''}`}
                        >
                          <input
                            type="radio"
                            name="solucao"
                            value={opt.id}
                            checked={checked}
                            onChange={() => {
                              setSolution(opt.id)
                              setTouched((t) => ({ ...t, solucao: true }))
                            }}
                            aria-invalid={Boolean(visibleError('solucao'))}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className={`flex size-4 shrink-0 items-center justify-center border transition-colors ${
                              checked ? 'border-accent bg-accent' : 'border-line-strong'
                            }`}
                          >
                            {checked && <Check className="size-3 text-accent-ink" strokeWidth={3} />}
                          </span>
                          {opt.label}
                        </label>
                      )
                    })}
                  </div>
                  <FieldError id="err-solucao" error={visibleError('solucao')} />
                </fieldset>

                <div className="mt-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor="field-descricao" className="label-mono text-muted">
                      Descrição do projeto
                    </label>
                    <span
                      className={`label-mono tabular-nums ${
                        fields.descricao.trim().length > DESCRIPTION_MAX ? 'text-danger' : 'text-muted'
                      }`}
                      aria-hidden="true"
                    >
                      {fields.descricao.trim().length}/{DESCRIPTION_MAX}
                    </span>
                  </div>
                  <textarea
                    id="field-descricao"
                    name="descricao"
                    rows={5}
                    value={fields.descricao}
                    onChange={(e) => update('descricao')(e.target.value)}
                    onBlur={blur('descricao')}
                    aria-invalid={Boolean(visibleError('descricao'))}
                    aria-describedby={`hint-descricao${visibleError('descricao') ? ' err-descricao' : ''}`}
                    placeholder="Ex.: linha de envase com paradas frequentes; queremos avaliar automação do abastecimento."
                    className={`mt-3 block w-full resize-y border bg-transparent px-4 py-3 leading-relaxed text-fg outline-none transition-colors placeholder:text-muted/70 focus:border-accent ${
                      visibleError('descricao') ? 'border-danger' : 'border-line-strong'
                    }`}
                  />
                  <p id="hint-descricao" className="mt-2 text-[0.875rem] text-muted">
                    Mínimo de {DESCRIPTION_MIN} caracteres. Inclua contexto, equipamentos envolvidos e o resultado esperado.
                  </p>
                  <FieldError id="err-descricao" error={visibleError('descricao')} />
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-[32ch] text-[0.875rem] leading-snug text-muted">
                    {whatsappNumber
                      ? 'Ao gerar, o WhatsApp abre em nova aba com a mensagem pronta para envio.'
                      : 'Ao gerar, você recebe o briefing estruturado para copiar.'}
                  </p>
                  <Button type="submit" icon={whatsappNumber ? <MessageSquare className="size-4" strokeWidth={1.75} /> : undefined}>
                    {whatsappNumber ? 'Gerar e abrir no WhatsApp' : 'Gerar briefing'}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="result"
                ref={resultRef}
                tabIndex={-1}
                onAnimationComplete={() => {
                  // Move o foco (e a rolagem) para o resultado quando ele termina de entrar.
                  const el = resultRef.current
                  if (el && document.activeElement !== el && !el.contains(document.activeElement)) {
                    el.focus({ preventScroll: true })
                    if (el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' })
                  }
                }}
                role="status"
                className="border border-line bg-bg p-5 outline-none sm:p-8 xl:p-10"
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -16 }}
                transition={{ duration: 0.45, ease: EASE_PRECISE }}
              >
                {phase === 'handoff' ? (
                  <ResultHeader tone="success" title="Briefing pronto no WhatsApp">
                    {popupBlocked
                      ? 'O navegador bloqueou a nova aba. Use o botão abaixo para abrir o WhatsApp com a mensagem pronta.'
                      : 'Abrimos o WhatsApp em uma nova aba com a mensagem preenchida. O envio é concluído por você no aplicativo.'}
                  </ResultHeader>
                ) : (
                  <ResultHeader tone="warning" title="Canal de envio não configurado">
                    O WhatsApp desta demonstração ainda não foi configurado, então nenhuma mensagem foi enviada. Copie o
                    briefing abaixo e encaminhe pelo canal de sua preferência.
                  </ResultHeader>
                )}

                <div className="mt-8">
                  <p className="label-mono text-muted">Briefing gerado</p>
                  <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap break-words border border-line bg-surface p-4 font-mono text-[0.8125rem] leading-relaxed text-fg">
                    {message}
                  </pre>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {phase === 'handoff' && whatsappNumber && (
                    <a
                      href={whatsappUrl(whatsappNumber, message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center gap-2.5 bg-accent px-5 font-medium text-accent-ink transition-colors hover:bg-fg hover:text-bg"
                    >
                      Abrir WhatsApp <ExternalLink aria-hidden="true" className="size-4" />
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={onCopy}
                    disabled={copyState === 'copying'}
                    className={`inline-flex min-h-12 items-center gap-2.5 px-5 font-medium transition-colors ${
                      phase === 'unconfigured'
                        ? 'bg-accent text-accent-ink hover:bg-fg hover:text-bg'
                        : 'border border-line-strong hover:border-fg'
                    }`}
                  >
                    {copyState === 'copying' ? (
                      <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : copyState === 'copied' ? (
                      <Check aria-hidden="true" className="size-4" />
                    ) : (
                      <Copy aria-hidden="true" className="size-4" />
                    )}
                    {copyState === 'copying' ? 'Copiando…' : copyState === 'copied' ? 'Briefing copiado' : 'Copiar briefing'}
                  </button>
                  <button
                    type="button"
                    onClick={backToEdit}
                    className="inline-flex min-h-12 items-center gap-2 px-3 text-muted transition-colors hover:text-fg"
                  >
                    Editar dados
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex min-h-12 items-center gap-2 px-3 text-muted transition-colors hover:text-fg"
                  >
                    <RotateCcw aria-hidden="true" className="size-4" /> Nova solicitação
                  </button>
                </div>
                <p aria-live="polite" className="mt-4 min-h-5 text-[0.875rem]">
                  {copyState === 'copied' && <span className="text-success">Texto copiado para a área de transferência.</span>}
                  {copyState === 'failed' && (
                    <span className="text-danger">Não foi possível copiar automaticamente. Selecione o texto acima e copie manualmente.</span>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function ResultHeader({ tone, title, children }: { tone: 'success' | 'warning'; title: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <span
        aria-hidden="true"
        className={`mt-1 flex size-9 shrink-0 items-center justify-center border ${
          tone === 'success' ? 'border-success text-success' : 'border-accent text-accent'
        }`}
      >
        {tone === 'success' ? <Check className="size-4" /> : <AlertCircle className="size-4" />}
      </span>
      <div>
        <h3 className="text-[1.5rem] font-medium leading-tight tracking-[-0.02em]">{title}</h3>
        <p className="mt-3 leading-relaxed text-muted">{children}</p>
      </div>
    </div>
  )
}

interface TextFieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur: () => void
  error?: string
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'text'
  className?: string
}

function TextField({ id, label, value, onChange, onBlur, error, type = 'text', autoComplete, inputMode, className = '' }: TextFieldProps) {
  const errId = `${id}-err`
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono text-muted">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          id={id}
          name={id.replace('field-', '')}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errId : undefined}
          className={`peer block min-h-12 w-full border-0 border-b bg-transparent px-0 py-2 text-[1.0625rem] text-fg outline-none transition-colors focus:border-accent ${
            error ? 'border-danger' : 'border-line-strong'
          }`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-precise)] peer-focus:scale-x-100"
        />
      </div>
      <FieldError id={errId} error={error} />
    </div>
  )
}

function FieldError({ id, error }: { id: string; error?: string }) {
  return (
    <AnimatePresence initial={false}>
      {error && (
        <motion.p
          id={id}
          className="mt-2 flex items-center gap-1.5 text-[0.875rem] text-danger"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  )
}
