import { media, type MediaImage } from './media'

export type ProjectFilter = 'todos' | 'automacao' | 'engenharia' | 'eletromecanica' | 'processos'

export const projectFilters: { id: ProjectFilter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'automacao', label: 'Automação' },
  { id: 'engenharia', label: 'Engenharia' },
  { id: 'eletromecanica', label: 'Eletromecânica' },
  { id: 'processos', label: 'Processos' },
]

export interface Project {
  id: string
  code: string
  title: string
  sector: string
  tags: Exclude<ProjectFilter, 'todos'>[]
  summary: string
  context: string
  objectives: string[]
  solutions: string[]
  scope: string[]
  image: MediaImage
}

export const projects: Project[] = [
  {
    id: 'modernizacao-linha',
    code: 'APP-01',
    title: 'Modernização de linha produtiva',
    sector: 'Manufatura discreta',
    tags: ['engenharia', 'automacao', 'eletromecanica'],
    summary:
      'Cenário de uma linha com equipamentos de gerações diferentes, comandos obsoletos e paradas frequentes para ajuste.',
    context:
      'Uma linha produtiva em operação há muitos anos reúne máquinas de fabricantes distintos, painéis com componentes descontinuados e pouca informação sobre o estado dos equipamentos. A modernização precisa acontecer sem interromper a produção por longos períodos.',
    objectives: [
      'Substituir comandos obsoletos por uma arquitetura de controle atual',
      'Reduzir ajustes manuais entre trocas de produto',
      'Planejar a migração em etapas, compatíveis com janelas de parada',
    ],
    solutions: [
      'Levantamento de campo e documentação do estado atual',
      'Novo projeto elétrico e de automação, com painéis padronizados',
      'Migração por módulos, com testes em bancada antes de cada parada',
    ],
    scope: ['Engenharia básica e detalhada', 'Painéis elétricos', 'Programação de CLP e IHM', 'Comissionamento'],
    image: media.projLine,
  },
  {
    id: 'integracao-sistemas',
    code: 'APP-02',
    title: 'Integração de sistemas automatizados',
    sector: 'Montagem automatizada',
    tags: ['automacao', 'processos'],
    summary:
      'Cenário de células robotizadas e transportadores que operam isolados, sem coordenação nem dados centralizados.',
    context:
      'Robôs, transportadores e estações de inspeção foram adquiridos em momentos diferentes e funcionam de forma independente. Sem coordenação entre eles, a linha acumula esperas e a supervisão depende de rondas presenciais.',
    objectives: [
      'Coordenar células e transportadores em uma lógica única',
      'Centralizar estados, alarmes e eventos em um supervisório',
      'Criar base de dados para análise de paradas',
    ],
    solutions: [
      'Arquitetura de rede industrial unificada',
      'Lógica de coordenação entre células com intertravamentos',
      'Supervisório com alarmes, eventos e histórico de paradas',
    ],
    scope: ['Arquitetura de controle', 'Redes industriais', 'Supervisório SCADA', 'Testes de integração'],
    image: media.projIntegration,
  },
  {
    id: 'implantacao-eletromecanica',
    code: 'APP-03',
    title: 'Implantação eletromecânica',
    sector: 'Infraestrutura de planta',
    tags: ['eletromecanica', 'engenharia'],
    summary:
      'Cenário de ampliação de planta que exige nova infraestrutura elétrica, acionamentos e montagem mecânica coordenada.',
    context:
      'A instalação de novos equipamentos de produção exige ampliar a infraestrutura elétrica, montar acionamentos e interligar utilidades. Diferentes frentes precisam trabalhar no mesmo espaço físico, com a planta em funcionamento ao lado.',
    objectives: [
      'Dimensionar a nova infraestrutura elétrica e mecânica',
      'Coordenar frentes de montagem no mesmo espaço',
      'Entregar o conjunto testado e documentado para operação',
    ],
    solutions: [
      'Projeto integrado de força, comando e montagem mecânica',
      'Planejamento de frentes e análise de riscos por atividade',
      'Comissionamento por sistema e documentação as-built',
    ],
    scope: ['Projeto elétrico e mecânico', 'Painéis e acionamentos', 'Montagem', 'Comissionamento'],
    image: media.projElectromech,
  },
  {
    id: 'reestruturacao-processos',
    code: 'APP-04',
    title: 'Reestruturação de processos industriais',
    sector: 'Operações e produção',
    tags: ['processos', 'engenharia'],
    summary:
      'Cenário de fluxo produtivo com gargalos, estoques intermediários e baixa previsibilidade de entrega.',
    context:
      'O volume de produção cresceu, mas o layout e as rotinas continuaram os mesmos. Estoques intermediários se acumulam entre etapas e a equipe não tem indicadores claros para identificar onde o fluxo trava.',
    objectives: [
      'Mapear o fluxo produtivo de ponta a ponta',
      'Identificar e priorizar gargalos e perdas',
      'Definir indicadores para acompanhar a evolução',
    ],
    solutions: [
      'Mapeamento de fluxo de valor e análise de capacidade por etapa',
      'Proposta de novo layout e rebalanceamento de postos',
      'Rotinas padronizadas e painel de indicadores operacionais',
    ],
    scope: ['Diagnóstico de processo', 'Estudo de layout', 'Padronização', 'Indicadores'],
    image: media.projProcess,
  },
]
