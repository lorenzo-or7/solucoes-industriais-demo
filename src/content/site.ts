export const navItems = [
  { id: 'solucoes', label: 'Soluções' },
  { id: 'especialidades', label: 'Especialidades' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'contato', label: 'Contato' },
] as const

export type NavId = (typeof navItems)[number]['id']

export const differentials = [
  {
    title: 'Planejamento personalizado',
    text: 'Cada escopo parte da realidade da planta: equipamentos, rotina, restrições e objetivos da operação.',
  },
  {
    title: 'Integração multidisciplinar',
    text: 'Mecânica, elétrica, automação e processos tratados juntos, com interfaces resolvidas no projeto.',
  },
  {
    title: 'Foco na eficiência',
    text: 'Soluções avaliadas pelo que mudam na operação: fluxo, disponibilidade e uso de recursos.',
  },
  {
    title: 'Segurança operacional',
    text: 'Análise de riscos, adequação de máquinas e procedimentos de trabalho em cada etapa.',
  },
  {
    title: 'Soluções escaláveis',
    text: 'Arquiteturas preparadas para crescer junto com a operação, sem refazer o que já funciona.',
  },
  {
    title: 'Acompanhamento técnico',
    text: 'Presença depois da partida, com ajustes, treinamento e documentação para a continuidade.',
  },
]

/** Número do WhatsApp configurado via variável de ambiente (apenas dígitos). */
export const whatsappNumber = (() => {
  const raw = (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').toString().replace(/\D/g, '')
  return raw.length >= 10 && raw.length <= 15 ? raw : null
})()
