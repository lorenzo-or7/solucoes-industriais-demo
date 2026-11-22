import { media, type MediaImage } from './media'

export interface ProcessStep {
  id: string
  index: string
  title: string
  lead: string
  description: string
  outputs: string[]
  image: MediaImage
}

export const processSteps: ProcessStep[] = [
  {
    id: 'diagnostico',
    index: '01',
    title: 'Diagnóstico',
    lead: 'Entender a operação antes de propor qualquer solução.',
    description:
      'Visita técnica, entrevistas com as equipes e levantamento de dados de campo. Mapeamos restrições, riscos e oportunidades para definir o problema real.',
    outputs: ['Levantamento técnico', 'Mapa de restrições', 'Definição do problema'],
    image: media.stepDiagnosis,
  },
  {
    id: 'planejamento',
    index: '02',
    title: 'Planejamento',
    lead: 'Escopo, engenharia e cronograma sobre base técnica.',
    description:
      'Desenvolvemos a solução, validamos premissas com o cliente e organizamos o cronograma de acordo com as janelas de parada e a rotina da planta.',
    outputs: ['Projeto técnico', 'Cronograma físico', 'Plano de riscos'],
    image: media.stepPlanning,
  },
  {
    id: 'implementacao',
    index: '03',
    title: 'Implementação',
    lead: 'Execução coordenada, com qualidade verificada por etapa.',
    description:
      'Fabricação, montagem, integração e testes. Cada etapa tem critérios de aceite e registros, e a partida acontece de forma controlada.',
    outputs: ['Montagem e integração', 'Testes e comissionamento', 'Partida assistida'],
    image: media.stepImplementation,
  },
  {
    id: 'acompanhamento',
    index: '04',
    title: 'Acompanhamento',
    lead: 'A solução precisa funcionar no dia a dia da operação.',
    description:
      'Acompanhamos a operação após a partida, ajustamos parâmetros, treinamos as equipes e entregamos a documentação para a continuidade.',
    outputs: ['Ajustes pós-partida', 'Treinamento', 'Documentação as-built'],
    image: media.stepMonitoring,
  },
]
