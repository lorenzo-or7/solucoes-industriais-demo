/**
 * Registro central de mídia. Todos os arquivos ficam em /public/media.
 * Fotografias: Unsplash (Licença Unsplash — uso livre, atribuição não obrigatória).
 * Vídeo: Pexels (Licença Pexels — uso livre, atribuição não obrigatória).
 * As atribuições são preservadas no rodapé por boa prática.
 */
export interface MediaImage {
  key: string
  alt: string
  /** Página original da fotografia */
  source: string
  provider: 'Unsplash' | 'Pexels'
}

const img = (key: string, alt: string, slug: string): MediaImage => ({
  key,
  alt,
  source: `https://unsplash.com/photos/${slug}`,
  provider: 'Unsplash',
})

export const media = {
  heroRobots: img('hero-robots', 'Robôs industriais laranja em uma linha de montagem', '8gr6bObQLOI'),
  manifestoPlant: img(
    'manifesto-plant',
    'Interior de uma grande planta industrial com luz entrando pelas janelas',
    'SLIFI67jv5k',
  ),
  solAutomation: img('sol-automation', 'Braço robótico industrial azul operando em fábrica', 'sz1CHL7Pky0'),
  solMaintenance: img(
    'sol-maintenance',
    'Técnico com óculos de proteção trabalhando em um equipamento industrial',
    'zekShM5_K64',
  ),
  solEngineering: img(
    'sol-engineering',
    'Peças mecânicas usinadas sobre desenhos técnicos de engenharia',
    'SRqJ3eli-4I',
  ),
  solInstallations: img(
    'sol-installations',
    'Rede de tubulações e válvulas industriais de aço inoxidável',
    '41X6FwTwPh4',
  ),
  solElectromech: img(
    'sol-electromech',
    'Painel de controle elétrico industrial aberto com fiação e módulos',
    'NAchd3UmxXo',
  ),
  solOptimization: img(
    'sol-optimization',
    'Equipe observando sistema automatizado de esteira transportadora',
    '4nfPgBofTs4',
  ),
  capPlanning: img(
    'cap-planning',
    'Engenheira medindo desenhos técnicos com paquímetro',
    'WDCE0T4khsE',
  ),
  capIntegration: img(
    'cap-integration',
    'Sala de controle com painéis de instrumentação e supervisão',
    '2CakbXfm_gM',
  ),
  capExecution: img(
    'cap-execution',
    'Soldador trabalhando em uma estrutura metálica com faíscas',
    'enPxH6uqABg',
  ),
  capSupport: img(
    'cap-support',
    'Eletricista testando um painel elétrico com multímetro',
    'PkHf7BUWbtk',
  ),
  projLine: img(
    'proj-line',
    'Linha produtiva com máquinas de grande porte em galpão industrial',
    'pWUyHVJgLhg',
  ),
  projIntegration: img(
    'proj-integration',
    'Robôs industriais montando a carroceria de um veículo',
    'jHZ70nRk7Ns',
  ),
  projElectromech: img(
    'proj-electromech',
    'Sequência de equipamentos elétricos e cabos em uma fábrica',
    'ERXFD4jLpJc',
  ),
  projProcess: img(
    'proj-process',
    'Operadores acompanhando uma linha de produção',
    'oLS6IxceVNs',
  ),
  stepDiagnosis: img(
    'step-diagnosis',
    'Profissionais de uniforme analisando uma planta impressa',
    'xYCBw1uIP_M',
  ),
  stepPlanning: img(
    'step-planning',
    'Profissional concentrado em várias telas de computador',
    'SQkt_CJ-ARs',
  ),
  stepImplementation: img(
    'step-implementation',
    'Cortadora a laser industrial trabalhando em chapa metálica',
    'x0Q7F6h-dXk',
  ),
  stepMonitoring: img(
    'step-monitoring',
    'Painel de controle com tela sensível ao toque em máquina industrial',
    '_XDK4naBbgw',
  ),
  contactPlant: img(
    'contact-plant',
    'Planta industrial iluminada à noite',
    '1uvJa08dNfQ',
  ),
} satisfies Record<string, MediaImage>

export const heroVideo = {
  sources: {
    desktop: `${import.meta.env.BASE_URL}media/video/hero-1280.mp4`,
    mobile: `${import.meta.env.BASE_URL}media/video/hero-960.mp4`,
  },
  poster: `${import.meta.env.BASE_URL}media/video/hero-poster.webp`,
  alt: 'Robôs industriais em operação em uma linha de montagem automotiva',
  credit: 'Engin Altundağ',
  source: 'https://www.pexels.com/video/pedestal-shot-of-a-car-manufacturing-facility-4468754/',
  provider: 'Pexels' as const,
}

export const imageSrc = (image: MediaImage, size: 800 | 1600) =>
  `${import.meta.env.BASE_URL}media/img/${image.key}-${size}.webp`

export const imageSrcSet = (image: MediaImage) =>
  `${imageSrc(image, 800)} 800w, ${imageSrc(image, 1600)} 1600w`
