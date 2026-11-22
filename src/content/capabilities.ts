import { media, type MediaImage } from './media'
import type { SolutionId } from './solutions'

export interface Capability {
  id: string
  code: string
  title: string
  lead: string
  description: string
  details: { label: string; value: string }[]
  deliverables: string[]
  /** Soluções em que esta capacidade atua diretamente */
  solutions: SolutionId[]
  image: MediaImage
}

export const capabilities: Capability[] = [
  {
    id: 'planejamento',
    code: 'CAP-01',
    title: 'Engenharia e planejamento',
    lead: 'Antes da primeira ferramenta, o problema precisa estar bem definido.',
    description:
      'Levantamento técnico em campo, análise de requisitos e definição de escopo. Transformamos a necessidade da operação em premissas de projeto, cronograma e critérios de aceitação mensuráveis.',
    details: [
      { label: 'Ponto de partida', value: 'Visita técnica e levantamento de campo' },
      { label: 'Ferramentas', value: 'CAD 2D/3D, estudos de layout, matrizes de requisitos' },
      { label: 'Interface', value: 'Engenharia, produção, manutenção e suprimentos do cliente' },
    ],
    deliverables: ['Memorial descritivo', 'Escopo e cronograma físico', 'Critérios de aceitação'],
    solutions: ['engenharia', 'otimizacao', 'automacao', 'instalacoes'],
    image: media.capPlanning,
  },
  {
    id: 'integracao',
    code: 'CAP-02',
    title: 'Integração de sistemas',
    lead: 'Equipamentos de fornecedores diferentes precisam operar como um só sistema.',
    description:
      'Integramos máquinas, controladores, instrumentação e sistemas de supervisão em uma arquitetura coerente. Protocolos, intertravamentos e fluxos de dados são definidos para que cada parte converse com as demais.',
    details: [
      { label: 'Camadas', value: 'Campo, controle, supervisão e dados' },
      { label: 'Protocolos', value: 'Redes industriais conforme o parque instalado' },
      { label: 'Validação', value: 'Testes de integração e simulação antes da partida' },
    ],
    deliverables: ['Arquitetura de controle', 'Lista de I/O e mapa de comunicação', 'Roteiro de testes'],
    solutions: ['automacao', 'eletromecanica', 'otimizacao'],
    image: media.capIntegration,
  },
  {
    id: 'execucao',
    code: 'CAP-03',
    title: 'Execução especializada',
    lead: 'Montagem em planta ativa exige método, segurança e coordenação.',
    description:
      'Equipes técnicas executam montagem mecânica, elétrica e de utilidades com planejamento de frentes, análise de riscos e controle de qualidade. A obra é organizada para conviver com a produção.',
    details: [
      { label: 'Frentes', value: 'Mecânica, elétrica, tubulação e estruturas' },
      { label: 'Segurança', value: 'Análise de riscos e permissões de trabalho por atividade' },
      { label: 'Qualidade', value: 'Inspeções por etapa e registros de conformidade' },
    ],
    deliverables: ['Plano de execução', 'Registros de inspeção', 'Comissionamento e partida'],
    solutions: ['instalacoes', 'eletromecanica', 'manutencao', 'automacao'],
    image: media.capExecution,
  },
  {
    id: 'suporte',
    code: 'CAP-04',
    title: 'Suporte técnico',
    lead: 'A entrega termina quando a operação está segura para seguir sozinha.',
    description:
      'Acompanhamento pós-partida, treinamento das equipes, ajustes finos e atendimento técnico. Documentação as-built e planos de manutenção garantem continuidade depois da entrega.',
    details: [
      { label: 'Formato', value: 'Acompanhamento presencial e remoto' },
      { label: 'Capacitação', value: 'Treinamento para operação e manutenção' },
      { label: 'Continuidade', value: 'Planos de manutenção e revisão periódica' },
    ],
    deliverables: ['Documentação as-built', 'Treinamentos', 'Plano de manutenção'],
    solutions: ['manutencao', 'automacao', 'eletromecanica', 'otimizacao'],
    image: media.capSupport,
  },
]
