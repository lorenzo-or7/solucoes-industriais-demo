import { solutions } from '../content/solutions'
import type { BriefingSolution } from '../hooks/useBriefing'

export interface BriefingData {
  nome: string
  empresa: string
  email: string
  solucao: BriefingSolution | null
  descricao: string
}

export type BriefingErrors = Partial<Record<keyof BriefingData, string>>

export const DESCRIPTION_MIN = 30
export const DESCRIPTION_MAX = 1200

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validate(data: BriefingData): BriefingErrors {
  const errors: BriefingErrors = {}
  const nome = data.nome.trim()
  if (!nome) errors.nome = 'Informe seu nome.'
  else if (nome.length < 2) errors.nome = 'O nome precisa ter pelo menos 2 caracteres.'

  if (!data.empresa.trim()) errors.empresa = 'Informe o nome da empresa.'

  const email = data.email.trim()
  if (!email) errors.email = 'Informe um e-mail para retorno.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Digite um e-mail válido, por exemplo nome@empresa.com.br.'

  if (!data.solucao) errors.solucao = 'Selecione o tipo de solução.'

  const desc = data.descricao.trim()
  if (!desc) errors.descricao = 'Descreva brevemente o desafio da operação.'
  else if (desc.length < DESCRIPTION_MIN)
    errors.descricao = `Conte um pouco mais: mínimo de ${DESCRIPTION_MIN} caracteres (faltam ${DESCRIPTION_MIN - desc.length}).`
  else if (desc.length > DESCRIPTION_MAX) errors.descricao = `Limite de ${DESCRIPTION_MAX} caracteres.`

  return errors
}

export const solutionLabel = (id: BriefingSolution | null) =>
  id === 'outro' ? 'Outro / ainda não definido' : (solutions.find((s) => s.id === id)?.title ?? '—')

/** Mensagem estruturada para envio via WhatsApp ou cópia. */
export function buildBriefing(data: BriefingData) {
  return [
    '*BRIEFING — AXIOM Industrial*',
    '',
    `*Nome:* ${data.nome.trim()}`,
    `*Empresa:* ${data.empresa.trim()}`,
    `*E-mail:* ${data.email.trim()}`,
    `*Tipo de solução:* ${solutionLabel(data.solucao)}`,
    '',
    '*Descrição do projeto:*',
    data.descricao.trim(),
  ].join('\n')
}

export const whatsappUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback para contextos sem Clipboard API (ex.: HTTP sem TLS)
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }
}
