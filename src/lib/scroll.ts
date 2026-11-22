/**
 * Rola até uma seção respeitando movimento reduzido.
 * Logo após fechar um diálogo/menu (que bloqueava a rolagem) o Chrome pode descartar a rolagem suave;
 * nesse caso, faz um salto direto para garantir o destino.
 */
export function scrollToSection(id: string, { updateHash = true } = {}) {
  const target = document.getElementById(id)
  if (!target) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const start = window.scrollY
  target.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' })
  if (updateHash) history.replaceState(null, '', `#${id}`)
  window.setTimeout(() => {
    const away = Math.abs(target.getBoundingClientRect().top) > 120
    if (away && Math.abs(window.scrollY - start) < 2) target.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, 200)
}
