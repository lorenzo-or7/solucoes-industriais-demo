import { media, type MediaImage } from './media'

export type SolutionId =
  | 'automacao'
  | 'manutencao'
  | 'engenharia'
  | 'instalacoes'
  | 'eletromecanica'
  | 'otimizacao'

export interface Solution {
  id: SolutionId
  code: string
  title: string
  short: string
  summary: string
  description: string
  specs: string[]
  applications: string[]
  benefits: string[]
  image: MediaImage
}

export const solutions: Solution[] = [
  {
    id: 'automacao',
    code: 'SYS-01',
    title: 'Automação Industrial',
    short: 'Automação',
    summary: 'Controle, robótica e supervisão para operações que precisam de repetibilidade.',
    description:
      'Projetamos e integramos arquiteturas de automação que conectam CLPs, robótica, instrumentação e sistemas supervisórios. O objetivo é reduzir intervenções manuais em tarefas repetitivas e dar à operação dados confiáveis para decidir.',
    specs: ['CLP e IHM', 'Robótica colaborativa e industrial', 'SCADA e supervisão', 'Redes industriais'],
    applications: [
      'Células robotizadas de manipulação e montagem',
      'Retrofit de painéis e lógicas de controle legadas',
      'Supervisão centralizada de linhas e utilidades',
      'Intertravamentos e lógicas de segurança de máquina',
    ],
    benefits: [
      'Processos mais repetíveis e rastreáveis',
      'Menos dependência de ajustes manuais',
      'Visibilidade em tempo real do estado da operação',
    ],
    image: media.solAutomation,
  },
  {
    id: 'manutencao',
    code: 'SYS-02',
    title: 'Manutenção Industrial',
    short: 'Manutenção',
    summary: 'Planos preventivos e preditivos para manter ativos críticos disponíveis.',
    description:
      'Estruturamos rotinas de manutenção preventiva, preditiva e corretiva com base na criticidade de cada ativo. Inspeções, análise de falhas e planos de intervenção são organizados para proteger a disponibilidade da planta.',
    specs: ['Preventiva e preditiva', 'Análise de falhas', 'Planos por criticidade', 'Gestão de sobressalentes'],
    applications: [
      'Planos de manutenção para máquinas críticas de produção',
      'Inspeções termográficas e de vibração em equipamentos rotativos',
      'Paradas programadas e grandes intervenções',
      'Revisão de procedimentos e históricos de manutenção',
    ],
    benefits: [
      'Paradas planejadas em vez de paradas inesperadas',
      'Vida útil de ativos melhor aproveitada',
      'Decisões de manutenção baseadas em histórico e condição',
    ],
    image: media.solMaintenance,
  },
  {
    id: 'engenharia',
    code: 'SYS-03',
    title: 'Projetos de Engenharia',
    short: 'Engenharia',
    summary: 'Engenharia conceitual, básica e detalhada com documentação executável.',
    description:
      'Desenvolvemos projetos multidisciplinares — mecânico, elétrico e de automação — desde o estudo conceitual até o detalhamento para execução. Cada entrega é pensada para ser construída, operada e mantida.',
    specs: ['Estudos de viabilidade', 'Engenharia básica e detalhada', 'Modelagem 3D', 'Memoriais e listas técnicas'],
    applications: [
      'Ampliação de linhas e novos layouts de produção',
      'Projeto de máquinas, dispositivos e estruturas',
      'Compatibilização entre disciplinas antes da obra',
      'Documentação as-built para plantas existentes',
    ],
    benefits: [
      'Menos retrabalho durante a execução',
      'Escopo, custos e prazos discutidos sobre base técnica',
      'Documentação clara para operação e manutenção',
    ],
    image: media.solEngineering,
  },
  {
    id: 'instalacoes',
    code: 'SYS-04',
    title: 'Instalações Industriais',
    short: 'Instalações',
    summary: 'Montagem de utilidades, tubulações e infraestrutura de processo.',
    description:
      'Executamos a montagem de infraestrutura industrial: tubulações de processo, utilidades, suportes, estruturas e interligações. Planejamento de frentes de trabalho e controle de qualidade acompanham cada etapa.',
    specs: ['Tubulações de processo', 'Ar comprimido e utilidades', 'Estruturas metálicas', 'Comissionamento'],
    applications: [
      'Redes de ar comprimido, água industrial e vapor',
      'Interligação de novos equipamentos à planta existente',
      'Montagem de suportes, plataformas e passarelas',
      'Adequações durante paradas de manutenção',
    ],
    benefits: [
      'Montagem coordenada com a rotina da operação',
      'Qualidade verificada antes da partida',
      'Infraestrutura preparada para expansões futuras',
    ],
    image: media.solInstallations,
  },
  {
    id: 'eletromecanica',
    code: 'SYS-05',
    title: 'Sistemas Eletromecânicos',
    short: 'Eletromecânica',
    summary: 'Painéis, acionamentos e conjuntos mecânicos integrados em um só escopo.',
    description:
      'Integramos as frentes elétrica e mecânica em um escopo único: painéis de força e comando, acionamentos, motores, transmissões e sistemas de movimentação. Uma única responsabilidade técnica do projeto à partida.',
    specs: ['Painéis de força e comando', 'Inversores e acionamentos', 'Motores e transmissões', 'Movimentação de materiais'],
    applications: [
      'Montagem e substituição de painéis elétricos',
      'Retrofit de acionamentos em transportadores e bombas',
      'Sistemas de movimentação e elevação de cargas',
      'Adequação de máquinas às normas de segurança aplicáveis',
    ],
    benefits: [
      'Interfaces elétricas e mecânicas resolvidas no projeto',
      'Uso de energia mais eficiente nos acionamentos',
      'Um único interlocutor técnico para o conjunto',
    ],
    image: media.solElectromech,
  },
  {
    id: 'otimizacao',
    code: 'SYS-06',
    title: 'Otimização de Processos',
    short: 'Processos',
    summary: 'Diagnóstico de gargalos e redesenho de fluxos produtivos.',
    description:
      'Mapeamos o fluxo produtivo para identificar gargalos, perdas e variabilidade. A partir do diagnóstico, propomos ajustes de layout, sequenciamento, padronização e automação pontual — priorizados por impacto e viabilidade.',
    specs: ['Mapeamento de fluxo', 'Análise de gargalos', 'Padronização de rotinas', 'Indicadores operacionais'],
    applications: [
      'Rebalanceamento de linhas e postos de trabalho',
      'Redução de deslocamentos e movimentações internas',
      'Definição de indicadores para acompanhamento da produção',
      'Priorização de investimentos em automação',
    ],
    benefits: [
      'Gargalos identificados com base em dados da operação',
      'Fluxo produtivo mais estável e previsível',
      'Investimentos direcionados ao que gera mais resultado',
    ],
    image: media.solOptimization,
  },
]

export const solutionById = (id: SolutionId) => solutions.find((s) => s.id === id)
