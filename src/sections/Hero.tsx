import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, Pause, Play, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { heroVideo } from '../content/media'
import { solutions } from '../content/solutions'
import { useBriefing } from '../hooks/useBriefing'
import { Button, LinkButton } from '../components/ui/Button'
import { EASE_MACHINE, EASE_PRECISE, MaskLines } from '../components/ui/motion'

type VideoStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

const fmt = (t: number) => {
  const s = Math.max(0, Math.floor(t))
  const frames = Math.floor((t - s) * 24)
  return `00:${String(s).padStart(2, '0')}:${String(frames).padStart(2, '0')}`
}

export function Hero() {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<VideoStatus>('idle')
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [src, setSrc] = useState<string | null>(null)
  const { requestProposal } = useBriefing()

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%'])
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08])
  const contentY = useTransform(scrollYProgress, [0, 0.7], [0, reduce ? 0 : -90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])
  const veil = useTransform(scrollYProgress, [0, 0.8], [0, 0.7])

  // Lazy loading do vídeo: só define a fonte após a montagem e respeita economia de dados / movimento reduzido.
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (conn?.saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatus('paused')
      return
    }
    const mobile = window.matchMedia('(max-width: 767px)').matches
    const id = window.setTimeout(() => {
      setSrc(mobile ? heroVideo.sources.mobile : heroVideo.sources.desktop)
      setStatus('loading')
    }, 300)
    return () => window.clearTimeout(id)
  }, [])

  // Pausa automaticamente quando a hero sai da tela (economia de recursos).
  useEffect(() => {
    const v = videoRef.current
    const section = sectionRef.current
    if (!v || !section) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !v.paused) {
        v.dataset.autopaused = 'true'
        v.pause()
      } else if (entry.isIntersecting && v.dataset.autopaused === 'true') {
        delete v.dataset.autopaused
        v.play().catch(() => {})
      }
    })
    io.observe(section)
    return () => io.disconnect()
  }, [src])

  const togglePlayback = () => {
    if (!src) {
      setSrc(window.matchMedia('(max-width: 767px)').matches ? heroVideo.sources.mobile : heroVideo.sources.desktop)
      setStatus('loading')
      return
    }
    const v = videoRef.current
    if (!v) return
    if (status === 'error') {
      setStatus('loading')
      v.load()
      v.play().catch(() => setStatus('error'))
      return
    }
    delete v.dataset.autopaused
    if (v.paused) v.play().catch(() => setStatus('paused'))
    else v.pause()
  }

  const playing = status === 'playing'
  const controlLabel =
    status === 'error' ? 'Tentar carregar o vídeo novamente' : playing ? 'Pausar vídeo de fundo' : 'Reproduzir vídeo de fundo'

  return (
    <section
      id="inicio"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="scope-dark relative isolate flex min-h-[640px] flex-col overflow-hidden bg-bg text-fg h-[100svh]"
    >
      {/* Mídia — Cinematic Hero Reveal + parallax */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(14% 10% 14% 10%)', opacity: 0.4 }}
        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE_MACHINE }}
      >
        <motion.div className="absolute inset-0 origin-bottom" style={{ y: mediaY, scale: mediaScale }}>
          <motion.div
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.18 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease: EASE_PRECISE }}
          >
            <img
              src={heroVideo.poster}
              alt=""
              aria-hidden="true"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {src && (
              <video
                ref={videoRef}
                src={src}
                poster={heroVideo.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
                onPlaying={() => setStatus('playing')}
                onPause={() => setStatus((s) => (s === 'error' ? s : 'paused'))}
                onWaiting={() => setStatus('loading')}
                onError={() => setStatus('error')}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                  status === 'error' ? 'opacity-0' : 'opacity-100'
                }`}
              />
            )}
          </motion.div>
        </motion.div>
        {/* Scrims de legibilidade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(11_14_17/0.94)_0%,rgb(11_14_17/0.55)_45%,rgb(11_14_17/0.35)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,rgb(11_14_17/0.7)_0%,transparent_65%)]"
        />
        <motion.div aria-hidden="true" className="absolute inset-0 bg-bg" style={{ opacity: veil }} />
      </motion.div>

      {/* Grade estrutural */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] hidden md:block">
        <div className="shell relative h-full">
          {[25, 50, 75].map((p, i) => (
            <motion.span
              key={p}
              className="absolute inset-y-0 w-px origin-top bg-[rgb(243_245_246/0.08)]"
              style={{ left: `${p}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.8, ease: EASE_MACHINE, delay: 0.6 + i * 0.12 }}
            />
          ))}
        </div>
      </div>

      <motion.div className="shell flex flex-1 flex-col pb-6 pt-28 md:pt-32" style={{ y: contentY, opacity: contentOpacity }}>
        {/* Linha editorial superior */}
        <motion.div
          className="flex items-start justify-between gap-6 border-t border-line pt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <p className="label-mono text-muted">
            <span className="text-accent">N°00</span> — Soluções industriais
          </p>
          <ul className="label-mono hidden max-w-[34rem] flex-wrap justify-end gap-x-4 gap-y-1 text-muted md:flex" aria-label="Áreas de atuação">
            {solutions.map((s) => (
              <li key={s.id}>{s.short}</li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-auto grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <MaskLines
              as="h1"
              id="hero-title"
              immediate
              delay={0.75}
              lines={['Engenharia', 'que move', <>o futuro<span className="text-accent">.</span></>]}
              className="display text-[clamp(2.9rem,14.4vw,9rem)] leading-[0.86] lg:text-[clamp(5rem,9.6vw,10.5rem)]"
            />
          </div>
          <motion.div
            className="flex flex-col gap-7 lg:col-span-4 lg:pb-3"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_PRECISE, delay: 1.35 }}
          >
            <p className="max-w-[26rem] text-[1.0625rem] leading-relaxed text-muted md:text-[1.125rem]">
              Soluções industriais desenvolvidas para transformar desafios técnicos em operações mais eficientes.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="#solucoes" icon={<ArrowDown className="size-4" strokeWidth={1.75} />}>
                Explorar soluções
              </LinkButton>
              <Button variant="ghost" onClick={() => requestProposal()}>
                Solicitar proposta
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Barra inferior: indicador de exploração + controle do vídeo */}
        <motion.div
          className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-3 md:mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7 }}
        >
          <a href="#manifesto" className="group flex min-h-11 items-center gap-3 text-muted transition-colors hover:text-fg">
            <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden bg-line">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-accent motion-reduce:animate-none" />
            </span>
            <span className="label-mono">Explorar</span>
          </a>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden items-center gap-3 sm:flex" aria-hidden="true">
              <span className="label-mono tabular-nums text-muted">
                {status === 'error' ? 'Sinal indisponível' : status === 'loading' ? 'Carregando' : fmt(time)}
              </span>
              <span className="relative block h-px w-24 bg-line">
                <span
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ width: duration ? `${(time / duration) * 100}%` : '0%' }}
                />
              </span>
            </div>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={controlLabel}
              aria-pressed={status === 'error' ? undefined : !playing}
              className="inline-flex min-h-11 items-center gap-2.5 border border-line px-3.5 text-fg transition-colors hover:border-fg"
            >
              {status === 'error' ? (
                <RotateCw aria-hidden="true" className="size-4" strokeWidth={1.75} />
              ) : playing ? (
                <Pause aria-hidden="true" className="size-4" strokeWidth={1.75} />
              ) : (
                <Play aria-hidden="true" className="size-4" strokeWidth={1.75} />
              )}
              <span className="label-mono">{status === 'error' ? 'Recarregar' : playing ? 'Pausar' : 'Reproduzir'}</span>
              {status === 'loading' && (
                <span aria-hidden="true" className="size-3 animate-spin rounded-full border border-muted border-t-transparent" />
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
