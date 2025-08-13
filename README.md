# 🌟 Portfolio Personale - Sito Moderno e Interattivo

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)
![Tests](https://img.shields.io/badge/Tests-Jest%20%2B%20Playwright-green?style=for-the-badge)

> **Portfolio personale moderno con animazioni avanzate, design responsive e architettura scalabile**

## 🎯 Panoramica

Questo è un portfolio personale sviluppato con le tecnologie più moderne del web development. Il sito presenta un design scuro elegante con accenti rossi, animazioni fluide e un'esperienza utente ottimizzata per tutti i dispositivi.

### ✨ Caratteristiche Principali

- 🎨 **Design Moderno**: Tema scuro con animazioni fluide e transizioni eleganti  
- 🚀 **Performance**: Ottimizzato per Core Web Vitals e Lighthouse scores  
- 📱 **Responsive**: Design mobile-first con supporto completo per tutti i dispositivi  
- ♿ **Accessibile**: WCAG 2.1 AA compliant con testing automatizzato  
- 🧪 **Tested**: Coverage >80% con unit testing (Jest) ed E2E testing (Playwright)  
- ⚡ **Fast**: Next.js 15 con Turbopack per sviluppo ultra-veloce  

### 🏗️ Sezioni del Sito

```
Hero → About Me → Projects → Capabilities → Process → Feedbacks → Contact → Footer
```

- **Hero**: Sezione introduttiva con animazioni 3D e effetti visivi
- **About**: Presentazione personale e background professionale  
- **Projects**: Portfolio progetti con dettagli tecnici e demo
- **Capabilities**: Skills tecnici e competenze specializzate
- **Process**: Metodologia di lavoro e approccio ai progetti
- **Feedbacks**: Testimonianze clienti e feedback
- **Contact**: Modulo contatti e informazioni di contatto

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 15.4.6](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Libreria UI con le ultime features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety e developer experience

### Styling & Design
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animazioni dichiarative e fluide
- **[GSAP](https://greensock.com/gsap/)** - Animazioni timeline professionali
- **[Radix UI](https://www.radix-ui.com/)** - Primitive componenti accessibili

### UI Components & Effects
- **[Lucide React](https://lucide.dev/)** - Icone moderne e scalabili
- **[Lightswind](https://lightswind.io/)** - Effetti luminosi avanzati
- **[OGL](https://github.com/oframe/ogl)** - WebGL per grafica 3D ottimizzata

### Testing & Quality
- **[Jest](https://jestjs.io/)** - Unit testing con coverage reporting
- **[Playwright](https://playwright.dev/)** - E2E testing cross-browser
- **[Testing Library](https://testing-library.com/)** - React testing utilities
- **[Axe Core](https://www.deque.com/axe/)** - Accessibility testing automatizzato
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality e formatting

## 🚀 Quick Start

### Prerequisiti
- **Node.js** 18.17+ 
- **npm** 9.0+ (o yarn/pnpm/bun equivalenti)

### Installazione

```bash
# Clone del repository
git clone [repository-url]
cd sito

# Installazione dipendenze
npm install

# Avvio server development
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) per vedere il risultato.

### 🏃 Comandi Disponibili

```bash
# Development
npm run dev           # Dev server con Turbopack (ultra-veloce)
npm run build         # Build di produzione ottimizzata
npm start            # Start production server

# Code Quality  
npm run lint         # ESLint check con autofix
npm run format       # Prettier formatting
npm run format:check # Validation formatting

# Testing
npm test                  # Unit tests con Jest
npm run test:watch        # Unit tests in watch mode  
npm run test:e2e:dev      # E2E tests in development
npm run test:e2e:ui       # E2E tests con interfaccia grafica
npm run test:e2e          # Full E2E pipeline (build + test)
```

## 📁 Struttura Progetto

```
src/
├── app/                    # 🏠 App Router Next.js 15
│   ├── layout.tsx         # Layout principale con provider
│   ├── page.tsx           # Homepage con tutte le sezioni
│   └── globals.css        # Stili globali e variabili CSS
│
├── components/            # 🧩 Componenti modulari
│   ├── sections/          # 📄 Sezioni principali del sito
│   │   ├── navbar.tsx     # Navigazione con animazioni
│   │   ├── hero.tsx       # Sezione hero con effetti 3D
│   │   ├── About.tsx      # Sezione about me
│   │   ├── Projects.tsx   # Portfolio progetti
│   │   └── ...           # Altre sezioni
│   │
│   ├── ui/               # 🎨 Componenti UI riutilizzabili
│   ├── reactbits/        # 📦 Componenti da ReactBits
│   └── animate-ui/       # ✨ Componenti animazione custom
│
├── lib/                   # 🔧 Utilities e helpers
│   ├── utils.ts          # Utilità generali (cn, etc.)
│   └── scroll-utils.ts   # Logica scroll e navigazione
│
├── __tests__/            # 🧪 Unit tests
├── e2e/                  # 🎭 End-to-end tests
└── public/               # 📸 Assets statici e media
```

## 🎨 Design System

### 🎨 Color Palette
```css
/* Primary Colors */
Background: #000000 (Black)
Text: #ffffff (White)
Accent: #ef4444 (Red 500)
Accent Dark: #dc2626 (Red 600)

/* Opacity Variants */
Text Subtle: rgba(255, 255, 255, 0.1)
Text Medium: rgba(255, 255, 255, 0.5)  
Text Strong: rgba(255, 255, 255, 0.8)
```

### 📝 Typography
- **Primary**: Geist Sans (Google Fonts)
- **Monospace**: Geist Mono (Google Fonts)  
- **Display**: Anton (Headers e titoli grandi)

### 📏 Responsive Breakpoints
```css
sm:  640px  /* Mobile large */
md:  768px  /* Tablet */
lg:  1024px /* Desktop */
xl:  1280px /* Desktop large */
2xl: 1536px /* Desktop extra large */
```

## ⚡ Performance

### 🎯 Core Web Vitals Targets
- **LCP**: <2.5s (Largest Contentful Paint)
- **FID**: <100ms (First Input Delay)  
- **CLS**: <0.1 (Cumulative Layout Shift)

### 🚀 Ottimizzazioni
- **Turbopack**: Dev server ultra-veloce
- **Next.js Image**: Ottimizzazione automatica immagini
- **Font Optimization**: Google Fonts con next/font
- **Bundle Splitting**: Code splitting automatico
- **Prefetching**: Link prefetching intelligente

## 🧪 Testing Strategy

### Unit Testing (Jest)
- **Coverage Target**: >80% statements, branches, functions
- **Test Types**: Component rendering, user interactions, utility functions
- **Mocking**: Automatic mocks per files statici e API

### E2E Testing (Playwright)
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Visual Regression**: Screenshot comparison automatico
- **Performance**: Core Web Vitals monitoring
- **Accessibility**: Axe integration per WCAG compliance

### Quality Gates
```bash
✅ ESLint: Zero linting errors
✅ TypeScript: Zero type errors  
✅ Tests: 100% test suite passing
✅ Coverage: >80% code coverage
✅ Performance: Core Web Vitals in green
✅ Accessibility: Axe tests passing
```

## 🔧 Development Guidelines

### 📋 Code Style
- **TypeScript strict mode**: Zero any types
- **ESLint + Prettier**: Code consistency automatica
- **Conventional Commits**: Commit message standardizzati
- **Component naming**: PascalCase per componenti, camelCase per utilità

### 🎯 Best Practices
- **Accessibility first**: WCAG 2.1 AA compliance
- **Performance conscious**: Bundle size monitoring
- **Type safety**: Interfacce esplicite per tutti i props
- **Test coverage**: TDD quando possibile

## 🤝 Contributing

1. **Fork** il progetto
2. **Create** il tuo feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add some AmazingFeature'`)  
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Open** una Pull Request

### 📝 Commit Convention
```
feat: add new component
fix: resolve animation bug
docs: update README
test: add unit tests for utils
chore: update dependencies
```

## 📊 Project Stats

- **Components**: 25+ componenti modulari
- **Test Coverage**: >80% codebase coverage  
- **Performance Score**: 95+ Lighthouse score
- **Accessibility Score**: 100% WCAG compliance
- **Bundle Size**: <500KB initial load
- **Dependencies**: Security-audited packages

## 🔗 Links Utili

- **[Next.js Documentation](https://nextjs.org/docs)** - Learn about Next.js features
- **[React Documentation](https://react.dev/)** - Learn React
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Utility-first CSS  
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Playwright](https://playwright.dev/)** - End-to-end testing

## 📧 Support & Contact

Per domande, suggerimenti o collaborazioni, non esitare a contattarmi attraverso il form contatti sul sito o tramite i canali social.

---

<div align="center">

**[🌐 Live Demo](https://your-portfolio-url.com)** | **[📖 Documentation](./CLAUDE.md)** | **[🐛 Report Bug](https://github.com/yourusername/repository/issues)**

Made with ❤️ using Next.js 15 + React 19

</div>