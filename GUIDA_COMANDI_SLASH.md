# Guida Comandi Slash per il Tuo Portfolio Next.js

## 📋 Analisi del Tuo Progetto

**Tecnologie Utilizzate:**
- Next.js 15.4.6 + React 19 + TypeScript
- Tailwind CSS 4 + Framer Motion + GSAP
- Animazioni avanzate con componenti custom
- Testing con Jest + Playwright + Testing Library
- Accessibilità con @axe-core/playwright

**Struttura del Progetto:**
- Portfolio personale con sezioni: Hero, About, Projects, Capabilities, Process, Feedback, Contact
- Componenti UI avanzati con animazioni
- Effetti visivi sofisticati (particle systems, glass effects, scroll animations)
- Testing completo (unit + e2e + accessibility)

---

## 🤖 WORKFLOWS (Raccomandati per il Tuo Progetto)

### 🎯 **Sviluppo di Nuove Funzionalità**

#### `/feature-development` ⭐⭐⭐⭐⭐
**QUANDO:** Vuoi aggiungere una nuova sezione o funzionalità completa
**COME:** `/feature-development [descrizione]`
**ESEMPI SPECIFICI:**
- `/feature-development Aggiungi sezione portfolio dettagliata con filtri per categoria`
- `/feature-development Implementa form di contatto con validazione e invio email`
- `/feature-development Crea sistema di blog con MDX e syntax highlighting`

**PERCHÉ È PERFETTO PER TE:**
- Coordina frontend (React/Next.js) + backend (API routes) + testing
- Implementa animazioni Framer Motion automaticamente
- Mantiene coerenza con il design esistente

#### `/full-stack-feature` ⭐⭐⭐⭐
**QUANDO:** Funzionalità che richiede sia frontend che backend
**ESEMPI:**
- `/full-stack-feature Sistema di commenti per il blog con moderazione admin`
- `/full-stack-feature Dashboard analytics per tracciare visite al portfolio`

### 🔍 **Analisi e Miglioramenti**

#### `/smart-fix` ⭐⭐⭐⭐⭐
**QUANDO:** Hai problemi di performance, bug, o vuoi ottimizzare
**ESEMPI:**
- `/smart-fix Le animazioni GSAP rallentano su dispositivi mobili`
- `/smart-fix Bundle size troppo grande, ottimizza il caricamento`
- `/smart-fix Migliorare Core Web Vitals per SEO`

#### `/full-review` ⭐⭐⭐⭐
**QUANDO:** Vuoi una revisione completa del codice
**ESEMPI:**
- `/full-review Analizza l'architettura dei componenti UI`
- `/full-review Verifica accessibilità e performance delle animazioni`

#### `/performance-optimization` ⭐⭐⭐⭐⭐
**QUANDO:** Il sito è lento o vuoi ottimizzare
**ESEMPI:**
- `/performance-optimization Ottimizza caricamento componenti animati`
- `/performance-optimization Riduci Time to Interactive per mobile`

### 🛡️ **Sicurezza e Qualità**

#### `/security-hardening` ⭐⭐⭐
**QUANDO:** Prima del deploy in produzione
**ESEMPI:**
- `/security-hardening Proteggi API routes e form di contatto`
- `/security-hardening Implementa CSP headers per sicurezza`

#### `/multi-platform` ⭐⭐⭐
**QUANDO:** Vuoi ottimizzare per tutti i dispositivi
**ESEMPI:**
- `/multi-platform Ottimizza animazioni per mobile, tablet, desktop`

---

## 🔧 TOOLS (Per Compiti Specifici)

### 🎨 **Frontend e UI**

#### `/api-scaffold` ⭐⭐⭐⭐⭐
**QUANDO:** Devi creare nuove API routes
**ESEMPI:**
- `/api-scaffold contact form con validazione e rate limiting`
- `/api-scaffold newsletter signup con Mailchimp integration`
- `/api-scaffold analytics tracker per portfolio views`

**PERFETTO PER:**
- Form di contatto
- Newsletter
- Tracking analytics
- Download CV

#### `/refactor-clean` ⭐⭐⭐⭐
**QUANDO:** I componenti diventano troppo complessi
**ESEMPI:**
- `/refactor-clean Semplifica i componenti delle animazioni GSAP`
- `/refactor-clean Organizza meglio la struttura dei componenti UI`

### 🧪 **Testing e Qualità**

#### `/test-harness` ⭐⭐⭐⭐⭐
**QUANDO:** Vuoi aggiungere test completi
**ESEMPI:**
- `/test-harness Testa tutte le animazioni e interazioni utente`
- `/test-harness Test accessibilità per screen readers`
- `/test-harness Test performance delle animazioni su mobile`

#### `/accessibility-audit` ⭐⭐⭐⭐⭐
**QUANDO:** Vuoi verificare l'accessibilità
**ESEMPI:**
- `/accessibility-audit Verifica conformità WCAG per tutto il portfolio`
- `/accessibility-audit Test navigazione da tastiera per animazioni`

### 🚀 **Performance e Ottimizzazione**

#### `/docker-optimize` ⭐⭐⭐⭐
**QUANDO:** Vuoi deployare con Docker
**ESEMPI:**
- `/docker-optimize Crea Dockerfile ottimizzato per portfolio Next.js`
- `/docker-optimize Multi-stage build per produzione`

#### `/monitor-setup` ⭐⭐⭐⭐
**QUANDO:** Vuoi monitorare il sito in produzione
**ESEMPI:**
- `/monitor-setup Configura Vercel Analytics + performance monitoring`
- `/monitor-setup Setup error tracking con Sentry`

### 🔒 **Sicurezza**

#### `/security-scan` ⭐⭐⭐⭐
**QUANDO:** Prima del deploy
**ESEMPI:**
- `/security-scan Controlla vulnerabilità nelle dipendenze`
- `/security-scan Audit sicurezza API routes`

#### `/deps-audit` ⭐⭐⭐⭐
**QUANDO:** Vuoi verificare le dipendenze
**ESEMPI:**
- `/deps-audit Controlla vulnerabilità in Framer Motion e GSAP`
- `/deps-audit Analizza licenze delle dipendenze`

### 📚 **Documentazione**

#### `/doc-generate` ⭐⭐⭐⭐
**QUANDO:** Vuoi documentare il progetto
**ESEMPI:**
- `/doc-generate Crea documentazione per i componenti animati`
- `/doc-generate Guida setup sviluppo per nuovi contributor`

#### `/code-explain` ⭐⭐⭐
**QUANDO:** Vuoi spiegare codice complesso
**ESEMPI:**
- `/code-explain Spiega la logica delle animazioni GSAP timeline`
- `/code-explain Documenta l'architettura dei componenti UI`

### 🐛 **Debug e Troubleshooting**

#### `/smart-debug` ⭐⭐⭐⭐⭐
**QUANDO:** Hai bug complessi
**ESEMPI:**
- `/smart-debug Le animazioni si sovrappongono su resize window`
- `/smart-debug Memory leak nelle animazioni Framer Motion`

#### `/error-trace` ⭐⭐⭐⭐
**QUANDO:** Errori in produzione
**ESEMPI:**
- `/error-trace Hydration mismatch sui componenti animati`
- `/error-trace Console errors su mobile Safari`

---

## 🎯 SCENARI DI USO SPECIFICI

### **Scenario 1: Aggiungere Blog al Portfolio**
```bash
# 1. Implementa la funzionalità completa
/feature-development Crea sezione blog con MDX, syntax highlighting e SEO

# 2. Ottimizza performance
/performance-optimization Ottimizza caricamento lazy per post del blog

# 3. Testa tutto
/test-harness Test completi per blog: rendering, SEO, accessibilità

# 4. Sicurezza
/security-scan Verifica sicurezza per commenti e form del blog
```

### **Scenario 2: Ottimizzazione Pre-Deploy**
```bash
# 1. Analisi performance
/smart-fix Ottimizza Core Web Vitals per produzione

# 2. Security audit
/security-scan Audit completo sicurezza prima deploy

# 3. Test accessibilità
/accessibility-audit Verifica WCAG compliance

# 4. Setup monitoring
/monitor-setup Configura analytics e error tracking
```

### **Scenario 3: Aggiungere E-commerce**
```bash
# 1. Backend per prodotti
/api-scaffold Product catalog con Stripe integration

# 2. Frontend componenti
/feature-development Shopping cart con animazioni smooth

# 3. Testing e2e
/test-harness Test completi flusso acquisto

# 4. Sicurezza pagamenti
/security-hardening Implementa sicurezza PCI compliant
```

### **Scenario 4: Migliorare Animazioni**
```bash
# 1. Analisi problemi performance
/smart-fix Ottimizza animazioni GSAP per 60fps mobile

# 2. Refactoring componenti
/refactor-clean Semplifica logica animazioni complesse

# 3. Test performance
/test-harness Test animazioni su diversi dispositivi

# 4. Documentazione
/doc-generate Guida utilizzo componenti animati
```

---

## ⚡ PRIORITÀ PER IL TUO PROGETTO

### **🔥 Alta Priorità (Usa Subito)**
1. **`/smart-fix`** - Per ottimizzare performance esistenti
2. **`/accessibility-audit`** - Verifica conformità accessibilità
3. **`/test-harness`** - Completa la coverage test
4. **`/security-scan`** - Audit sicurezza pre-deploy

### **🎯 Media Priorità (Prossimi Step)**
1. **`/feature-development`** - Nuove funzionalità (blog, e-commerce)
2. **`/monitor-setup`** - Monitoring produzione
3. **`/api-scaffold`** - API per form contatto/newsletter
4. **`/doc-generate`** - Documentazione progetto

### **📈 Bassa Priorità (Future)**
1. **`/docker-optimize`** - Se vuoi containerizzare
2. **`/multi-platform`** - Se espandi a mobile app
3. **`/ml-pipeline`** - Se aggiungi AI features

---

## 🏆 BEST PRACTICES

### **Workflow Efficace**
1. **Analisi Prima:** `/smart-fix` o `/full-review` per capire lo stato
2. **Implementa:** `/feature-development` o tool specifici
3. **Testa:** `/test-harness` + `/accessibility-audit`
4. **Sicurezza:** `/security-scan` prima del deploy
5. **Monitor:** `/monitor-setup` per produzione

### **Per Massima Efficienza**
- **Descrizioni dettagliate:** Specifica tecnologie (Next.js, Framer Motion, GSAP)
- **Contesto chiaro:** Menziona se è per mobile, desktop, o entrambi
- **Obiettivi specifici:** Performance, accessibilità, SEO, etc.

### **Comandi da Evitare per Ora**
- `/ml-pipeline` - Non necessario per portfolio base
- `/k8s-manifest` - Overkill per portfolio singolo
- `/compliance-check` - Non serve per portfolio personale

---

## 🎯 ESEMPI PRONTI ALL'USO

### **Setup Iniziale Completo**
```bash
/accessibility-audit Verifica conformità WCAG per tutto il portfolio
/test-harness Implementa test completi per componenti animati
/security-scan Audit sicurezza prima deploy produzione
/monitor-setup Configura Vercel Analytics e error tracking
```

### **Ottimizzazione Performance**
```bash
/smart-fix Ottimizza bundle size e Core Web Vitals
/performance-optimization Migliora animazioni GSAP per mobile
/docker-optimize Crea build ottimizzato per deploy
```

### **Nuove Funzionalità**
```bash
/feature-development Blog integrato con MDX e SEO optimization
/api-scaffold Contact form con validazione e email automation
/feature-development Portfolio gallery con filtri dinamici
```

---

## 💡 SUGGERIMENTI FINALI

1. **Inizia sempre con `/smart-fix`** per identificare problemi attuali
2. **Usa `/test-harness`** per ogni nuova funzionalità
3. **`/accessibility-audit`** è cruciale per un portfolio professionale
4. **Combina workflow + tools** per risultati ottimali
5. **Documenta con `/doc-generate`** le implementazioni complesse

**Il tuo portfolio ha ottime basi - questi comandi ti aiuteranno a portarlo al livello successivo! 🚀**