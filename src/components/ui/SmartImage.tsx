import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { imageSrc, imageSrcSet, type MediaImage } from '../../content/media'

interface SmartImageProps {
  image: MediaImage
  sizes?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  /** Imagem puramente decorativa (alt vazio) */
  decorative?: boolean
}

/**
 * Imagem responsiva com carregamento progressivo e fallback para conteúdo indisponível.
 */
export function SmartImage({
  image,
  sizes = '100vw',
  className = '',
  imgClassName = '',
  priority = false,
  decorative = false,
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')

  return (
    <div className={`relative overflow-hidden bg-surface-2 ${className}`}>
      {status === 'loading' && (
        <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-surface-2" />
      )}
      {status === 'error' ? (
        <div
          role={decorative ? undefined : 'img'}
          aria-label={decorative ? undefined : `${image.alt} (imagem indisponível)`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-2 text-muted"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, transparent 0 14px, var(--border) 14px 15px)',
          }}
        >
          <ImageOff aria-hidden="true" className="size-5" />
          <span className="label-mono bg-surface-2 px-2 py-1">Imagem indisponível</span>
        </div>
      ) : (
        <img
          src={imageSrc(image, 1600)}
          srcSet={imageSrcSet(image)}
          sizes={sizes}
          alt={decorative ? '' : image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
}
