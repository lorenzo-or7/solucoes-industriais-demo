# AXIOM Industrial — protótipo comercial (Or7.dev)

Website demonstrativo para empresas de soluções industriais. **AXIOM Industrial é uma marca fictícia e substituível**; os cenários de projeto são ilustrativos e não representam realizações comprovadas.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (tokens em `src/index.css`)
- Motion para React (reveals, transições, scroll-linked)
- Lucide React (ícones)
- Fontes self-hosted via Fontsource: Spline Sans (variável) e IBM Plex Mono

GSAP foi avaliado e **não** foi incluído: o Motion já cobre os efeitos vinculados ao scroll (`useScroll`/`useTransform`), evitando uma biblioteca redundante.

## Scripts

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # typecheck (tsc -b) + build de produção em dist/
npm run preview   # serve o build
npm run lint      # oxlint
```

## WhatsApp do formulário

O formulário de briefing gera uma mensagem estruturada. Para enviá-la por WhatsApp, defina o número em `.env.local`:

```bash
VITE_WHATSAPP_NUMBER=55DDDNUMERO   # apenas dígitos, formato internacional
```

Sem número configurado, o site **não simula envio**: exibe o briefing gerado, oferece "Copiar briefing" e informa que o canal não foi configurado. Com número configurado, abre `wa.me` em nova aba com a mensagem pronta (o envio é concluído pelo usuário no WhatsApp).

## Estrutura

```
src/
  content/      textos e dados (soluções, capacidades, projetos, processo, mídia)
  components/
    layout/     Navbar (menu mobile), Footer, ThemeToggle, Logo
    ui/         Button, Dialog, SmartImage, SectionHead, primitivas de motion
  sections/     Hero, Manifesto, Solutions, Capabilities, Projects, Process, Differentials, Contact
  hooks/        tema persistente, seção ativa, briefing compartilhado, media query
  lib/          montagem/validação do briefing, rolagem
public/media/   vídeo da hero (+ poster) e fotografias em WebP (800 e 1600 px)
```

Para trocar a marca: edite `src/components/layout/Logo.tsx`, os textos em `src/content/` e as cores em `src/index.css`.

## Créditos de mídia

- Fotografias: [Unsplash](https://unsplash.com/license) — links individuais em `src/content/media.ts` e no rodapé ("Créditos de imagem").
- Vídeo da hero: Engin Altundağ / [Pexels](https://www.pexels.com/license/).

Ambas as licenças permitem uso comercial sem atribuição obrigatória; os créditos foram mantidos por boa prática.


## GitHub Pages

Repositório: `solucoes-industriais-demo`. Configure Settings > Pages > GitHub Actions.

https://lorenzo-or7.github.io/solucoes-industriais-demo/
