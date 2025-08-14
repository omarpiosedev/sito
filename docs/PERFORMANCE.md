# 📊 Guida alle Performance del Sito

Guida completa per monitorare e ottimizzare le performance del tuo sito Next.js.

## 🚀 Come Testare le Performance

### 1. **Test Rapidi (Durante lo Sviluppo)**

```bash
# Avvia il server di sviluppo
npm run dev

# Test delle performance con Playwright
npm run perf:vitals
```

### 2. **Analisi del Bundle**

```bash
# Analizza le dimensioni dei bundle
npm run build:analyze
```

Questo aprirà una visualizzazione interattiva delle dimensioni dei tuoi bundle JavaScript.

### 3. **Audit Completo delle Performance**

```bash
# Build e test completo (consigliato prima del deploy)
npm run perf:full
```

Questo comando:
- 🏗️ Fa il build della produzione
- 🚀 Avvia il server
- 📊 Esegue audit Lighthouse completo
- 📄 Genera report HTML e JSON

### 4. **Test Lighthouse Manuale**

```bash
# Con server già in esecuzione
npm run start
# In un altro terminale:
npm run perf:lighthouse
```

## 📈 Metriche da Monitorare

### **Core Web Vitals** 🎯

| Metrica | Buono | Da Migliorare | Povero |
|---------|-------|---------------|--------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| **FID** (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### **Altre Metriche Importanti** ⚡

- **FCP** (First Contentful Paint): < 1.8s
- **Speed Index**: < 3.4s
- **TBT** (Total Blocking Time): < 200ms

## 🛠️ Strumenti Disponibili

### **1. Playwright Performance Tests**
File: `tests/performance.spec.ts`

Testa automaticamente:
- ✅ Core Web Vitals
- ✅ Tempo di caricamento
- ✅ Dimensioni bundle
- ✅ Accessibilità
- ✅ Performance mobile
- ✅ Lazy loading immagini

```bash
npm run perf:vitals
```

### **2. Lighthouse Audit**
Script: `scripts/performance-audit.js`

Genera:
- 📊 Report HTML dettagliato
- 📋 Punteggi Performance, Accessibility, SEO
- 🎯 Core Web Vitals
- 💡 Suggerimenti di ottimizzazione

```bash
npm run perf:audit
```

### **3. Bundle Analyzer**
Configurazione in `next.config.ts`

Mostra:
- 📦 Dimensioni dei bundle
- 📈 Dipendenze più pesanti
- 🔍 Opportunità di code splitting

```bash
npm run build:analyze
```

## 📊 Come Interpretare i Risultati

### **Punteggi Lighthouse**

- **90-100**: Eccellente ⭐⭐⭐⭐⭐
- **50-89**: Da migliorare ⚠️
- **0-49**: Povero ❌

### **Obiettivi del Progetto**

| Categoria | Target | Attuale |
|-----------|--------|---------|
| Performance | ≥ 90 | Da testare |
| Accessibility | ≥ 95 | Da testare |
| Best Practices | ≥ 90 | Da testare |
| SEO | ≥ 95 | Da testare |

## 🚨 Cosa Fare Se i Risultati Non Sono Buoni

### **Performance < 90**
1. 🖼️ Ottimizza immagini (usa Next.js Image)
2. 📦 Riduci bundle size (code splitting)
3. ⚡ Implementa lazy loading
4. 🗄️ Usa caching headers

### **Accessibility < 95**
1. 🏷️ Aggiungi alt text alle immagini
2. 🎨 Migliora contrasto colori
3. ⌨️ Testa navigazione da tastiera
4. 📱 Verifica responsiveness

### **SEO < 95**
1. 📝 Aggiungi meta descriptions
2. 🏷️ Usa heading tags appropriati
3. 🔗 Aggiungi structured data
4. 📱 Verifica mobile-friendliness

## 🔄 Monitoraggio Continuo

### **Durante lo Sviluppo**
```bash
# Test rapidi durante sviluppo
npm run dev
npm run perf:vitals
```

### **Prima del Deploy**
```bash
# Test completo pre-produzione
npm run perf:full
```

### **Automazione CI/CD**
Aggiungi ai tuoi workflow GitHub Actions:

```yaml
- name: Performance Tests
  run: npm run perf:full
```

## 📁 File e Directory Performance

```
├── tests/
│   └── performance.spec.ts        # Test Playwright performance
├── scripts/
│   └── performance-audit.js       # Script Lighthouse audit
├── reports/                       # Report generati automaticamente
│   ├── lighthouse-*.html
│   └── lighthouse-*.json
└── docs/
    └── PERFORMANCE.md             # Questa guida
```

## 🎯 Best Practices

### **Ottimizzazione Immagini**
- ✅ Usa `next/image` per ottimizzazione automatica
- ✅ Implementa lazy loading
- ✅ Usa formati moderni (WebP, AVIF)

### **JavaScript**
- ✅ Code splitting automatico di Next.js
- ✅ Dynamic imports per componenti pesanti
- ✅ Tree shaking per rimuovere codice inutilizzato

### **CSS**
- ✅ CSS-in-JS per scoping automatico
- ✅ Critical CSS inlining
- ✅ Minificazione automatica

### **Caching**
- ✅ Service Worker per caching
- ✅ CDN per static assets
- ✅ HTTP headers appropriati

## 🎛️ Configurazione Avanzata

### **next.config.ts**
- Bundle analyzer integrato
- Ottimizzazioni produzione
- Image optimization

### **playwright.config.ts**
- Configurazione device emulation
- Performance budgets
- Accessibility testing

## 📞 Supporto

Se i risultati non migliorano dopo le ottimizzazioni:

1. 📊 Controlla i report dettagliati in `/reports/`
2. 🔍 Analizza le metriche specifiche che falliscono
3. 💡 Consulta i suggerimenti di Lighthouse
4. 🛠️ Implementa le ottimizzazioni step by step

---

**🎯 Obiettivo**: Mantenere tutti i punteggi > 90 e Core Web Vitals nella zona "Good"