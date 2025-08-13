# 🚀 Guida Completa ai Comandi Claude Code

## 📖 Introduzione

Benvenuto nella guida completa a **tutti i 69 comandi slash** disponibili in Claude Code! Questa guida ti aiuterà a padroneggiare l'intero ecosistema di sviluppo AI-powered.

### 🎭 I Tre Sistemi di Claude Code

Claude Code integra **tre sistemi distinti** per massimizzare produttività:

#### 🧠 **1. SuperClaude Framework (17 comandi)**
Sistema AI avanzato con orchestrazione intelligente, modalità Wave e consensus multi-esperto.
- **Prefisso**: Nessuno (es. `/analyze`, `/build`, `/sc:auto`)
- **Caratteristiche**: Wave mode, personas auto-attive, intelligence adattiva
- **Quando usare**: Per operazioni complesse che richiedono ragionamento AI

#### ⚡ **2. Comandi Workflow (14 comandi)** 
Multi-agent orchestration per processi complessi coordinati.
- **Prefisso**: `/workflow-*` 
- **Caratteristiche**: Coordinazione di agenti specializzati, task multi-fase
- **Quando usare**: Per progetti che richiedono coordinazione di più specialisti

#### 🔧 **3. Comandi Tools (38 comandi)**
Utilità specializzate per tasks specifici e produttività istantanea.
- **Prefisso**: `/tool-*`
- **Caratteristiche**: Single-purpose, velocità, specializzazione
- **Quando usare**: Per task specifici ben definiti

### 🎯 Come Leggere Questa Guida

**Simboli utilizzati:**
- 🎯 **Scopo**: Obiettivo principale del comando
- 🤖 **Agents**: Agenti specializzati utilizzati
- 🔗 **Integrazione**: Server esterni o tool specifici
- 🛠️ **Specializzazione**: Area di competenza
- ⚡ **Complessità**: Semplice → Complesso
- 💡 **Esempi**: Casi d'uso pratici
- 🚀 **Performance**: Indicatore velocità/potenza

---

## 🧠 SUPERCLAUDE FRAMEWORK - 17 Comandi

*Sistema AI avanzato con intelligence adattiva, wave mode e orchestrazione multi-esperto*

### 🔨 SVILUPPO & IMPLEMENTAZIONE

#### `/build [target] [@path] [!command] [--flags]`

🎯 **Scopo**: Costruzione intelligente di progetti con rilevamento automatico del framework

🤖 **Persona Auto-Attiva**: Frontend, Backend, Architect, Scribe (in base al contesto)

🔗 **Integrazione MCP**: 
- **Magic** per build di UI e componenti
- **Context7** per pattern e best practices
- **Sequential** per logica complessa

🛠️ **Strumenti**: Read, Grep, Glob, Bash, TodoWrite, Edit, MultiEdit

⚡ **Wave Mode**: Abilitato per progetti complessi

💡 **Esempi**:
```bash
/build                          # Build completo del progetto
/build frontend                 # Build solo frontend
/build @src/components          # Build di una cartella specifica
/build --prod                   # Build per produzione
/build api !npm run build:api   # Build con comando personalizzato
```

**Caratteristiche Speciali**:
- Rilevamento automatico del framework (React, Vue, Angular, Node.js, etc.)
- Ottimizzazione delle performance durante il build
- Gestione automatica delle dipendenze

---

#### `/implement [feature-description] [--type] [--framework] [--flags]`

🎯 **Scopo**: Implementazione di funzionalità e codice con attivazione intelligente di persona

🤖 **Persona Auto-Attiva**: Frontend, Backend, Architect, Security (dipende dal contesto)

🔗 **Integrazione MCP**:
- **Magic** per componenti UI
- **Context7** per pattern di implementazione
- **Sequential** per logica complessa

🛠️ **Strumenti**: Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task

⚡ **Wave Mode**: Abilitato per feature complesse

💡 **Esempi**:
```bash
/implement "sistema di autenticazione con JWT"
/implement "dashboard utente" --type component
/implement "API REST per prodotti" --type api
/implement "form di registrazione" --framework react
/implement "sistema di pagamento" --type service
```

**Parametri Speciali**:
- `--type`: component, api, service, feature
- `--framework`: react, vue, angular, express, etc.

---

### 🔍 ANALISI & INVESTIGAZIONE

#### `/analyze [target] [@path] [!command] [--flags]`

🎯 **Scopo**: Analisi multi-dimensionale di codice e sistemi con valutazione approfondita

🤖 **Persona Auto-Attiva**: Analyzer, Architect, Security

🔗 **Integrazione MCP**:
- **Sequential** (primario) per analisi strutturata
- **Context7** per pattern di analisi
- **Magic** per analisi UI

🛠️ **Strumenti**: Read, Grep, Glob, Bash, TodoWrite

⚡ **Wave Mode**: Abilitato per analisi complesse

💡 **Esempi**:
```bash
/analyze                        # Analisi completa del progetto
/analyze performance            # Analisi delle performance
/analyze security              # Analisi della sicurezza
/analyze @src/api              # Analisi di una cartella specifica
/analyze architecture          # Analisi dell'architettura
/analyze --focus security      # Analisi focalizzata sulla sicurezza
```

---

#### `/troubleshoot [symptoms] [flags]`

🎯 **Scopo**: Investigazione sistematica di problemi e debugging avanzato

🤖 **Persona Auto-Attiva**: Analyzer, QA

🔗 **Integrazione MCP**: Sequential, Playwright

💡 **Esempi**:
```bash
/troubleshoot "app crashes on startup"
/troubleshoot "API response slow"
/troubleshoot memory-leak
/troubleshoot --env production
```

---

#### `/explain [topic] [flags]`

🎯 **Scopo**: Spiegazioni educative dettagliate per apprendimento e comprensione

🤖 **Persona Auto-Attiva**: Mentor, Scribe

🔗 **Integrazione MCP**: Context7, Sequential

💡 **Esempi**:
```bash
/explain "React hooks"
/explain "database normalization"
/explain JWT
/explain --detailed "async/await in JavaScript"
```

---

### ✨ QUALITÀ & MIGLIORAMENTO

#### `/improve [target] [@path] [!command] [--flags]`

🎯 **Scopo**: Miglioramento basato su evidenze con ottimizzazione intelligente

🤖 **Persona Auto-Attiva**: Refactorer, Performance, Architect, QA

🔗 **Integrazione MCP**:
- **Sequential** per logica di miglioramento
- **Context7** per pattern ottimali
- **Magic** per miglioramenti UI

🛠️ **Strumenti**: Read, Grep, Glob, Edit, MultiEdit, Bash

⚡ **Wave Mode**: Abilitato per miglioramenti sistematici

💡 **Esempi**:
```bash
/improve                       # Miglioramento generale del progetto
/improve performance          # Ottimizzazione delle performance
/improve security             # Miglioramenti di sicurezza
/improve @src/components      # Miglioramento componenti
/improve code-quality         # Miglioramento qualità del codice
/improve --loop               # Miglioramento iterativo
```

---

#### `/cleanup [target] [flags]`

🎯 **Scopo**: Pulizia del progetto e riduzione sistematica del debito tecnico

🤖 **Persona Auto-Attiva**: Refactorer

🔗 **Integrazione MCP**: Sequential

💡 **Esempi**:
```bash
/cleanup                      # Pulizia completa
/cleanup unused-imports       # Rimozione import inutilizzati
/cleanup dead-code           # Rimozione codice morto
/cleanup dependencies       # Pulizia dipendenze
```

---

### 🧪 TESTING & VALIDAZIONE

#### `/test [type] [flags]`

🎯 **Scopo**: Workflow di testing completi con validazione automatica

🤖 **Persona Auto-Attiva**: QA

🔗 **Integrazione MCP**: Playwright, Sequential

💡 **Esempi**:
```bash
/test                         # Esecuzione di tutti i test
/test unit                    # Solo test unitari
/test e2e                     # Test end-to-end
/test integration             # Test di integrazione
/test --coverage              # Test con coverage report
/test --watch                 # Test in modalità watch
```

---

### 📚 DOCUMENTAZIONE & COMUNICAZIONE

#### `/document [target] [flags]`

🎯 **Scopo**: Generazione intelligente di documentazione professionale

🤖 **Persona Auto-Attiva**: Scribe, Mentor

🔗 **Integrazione MCP**: Context7, Sequential

💡 **Esempi**:
```bash
/document api                 # Documentazione API
/document readme              # Creazione/aggiornamento README
/document @src/utils          # Documentazione di utilities
/document --lang it           # Documentazione in italiano
/document architecture        # Documentazione architettura
```

---

### 📊 GESTIONE PROGETTI

#### `/estimate [target] [flags]`

🎯 **Scopo**: Stime basate su evidenze per pianificazione accurata

🤖 **Persona Auto-Attiva**: Analyzer, Architect

🔗 **Integrazione MCP**: Sequential, Context7

💡 **Esempi**:
```bash
/estimate "new user dashboard"
/estimate refactoring
/estimate @src/api
/estimate --detailed "e-commerce platform"
```

---

#### `/task [operation] [flags]`

🎯 **Scopo**: Gestione progetto a lungo termine con orchestrazione multi-sessione

🤖 **Persona Auto-Attiva**: Architect, Analyzer

🔗 **Integrazione MCP**: Sequential

⚡ **Wave Mode**: Abilitato per progetti complessi

💡 **Esempi**:
```bash
/task create "implement user authentication"
/task list                    # Lista task attivi
/task status                  # Stato dei task
/task complete "login-form"   # Completa un task
```

---

### 🔄 CONTROLLO VERSIONE

#### `/git [operation] [flags]`

🎯 **Scopo**: Assistente workflow Git con automazione intelligente

🤖 **Persona Auto-Attiva**: DevOps, Scribe, QA

🔗 **Integrazione MCP**: Sequential

💡 **Esempi**:
```bash
/git commit "Add user authentication"
/git push                     # Push con controlli pre-push
/git merge feature-branch     # Merge intelligente
/git status                   # Status con analisi
/git cleanup                  # Pulizia branches
```

---

### 🎨 DESIGN & ARCHITETTURA

#### `/design [domain] [flags]`

🎯 **Scopo**: Orchestrazione del design con focus su UX e architettura

🤖 **Persona Auto-Attiva**: Architect, Frontend

🔗 **Integrazione MCP**: Magic, Sequential, Context7

⚡ **Wave Mode**: Abilitato per design systems

💡 **Esempi**:
```bash
/design ui                    # Design sistema UI
/design architecture          # Design architettura
/design database             # Design database schema
/design api                  # Design API structure
/design --responsive         # Design responsive
```

---

## 🚀 META-INTELLIGENZA & ORCHESTRAZIONE

### `/sc:auto "[prompt]" [flags]` ⭐ **COMANDO PRINCIPALE**

🎯 **Scopo**: Orchestratore AI definitivo con intelligenza zero-error e workflow adattivo

🤖 **Persona Auto-Attiva**: Attivazione dinamica multi-esperto basata sull'analisi del prompt

🔗 **Integrazione MCP**: Tutti i server con coordinazione intelligente (Context7, Sequential, Magic, Playwright)

🛠️ **Strumenti**: Tutti gli strumenti + Task agents + 44 agenti specializzati Claude Code

⚡ **Wave Mode**: Abilitato con ottimizzazione adattiva

💡 **Esempi**:
```bash
# Task UI semplici
/sc:auto "crea un form di login responsive con validazione"
→ Agenti: frontend-developer, performance-engineer
→ Personas: frontend, security
→ MCP: Magic, Context7

# Audit di sicurezza  
/sc:auto "controlla il sistema di autenticazione per vulnerabilità"
→ Agenti: security-auditor, backend-architect, database-optimizer
→ Personas: security, analyzer, backend
→ MCP: Sequential, Context7

# Ottimizzazione performance
/sc:auto "ottimizza i tempi di risposta API in tutta l'applicazione"
→ Agenti: performance-engineer, database-optimizer, backend-architect
→ Personas: performance, architect, analyzer
→ MCP: Sequential, Playwright

# Feature full-stack completa
/sc:auto "implementa dashboard utente con notifiche in tempo reale"
→ Agenti: frontend-developer, backend-architect, database-admin, deployment-engineer
→ Personas: frontend, backend, architect, devops
→ MCP: Tutti i server, Modalità Wave attivata
```

**Caratteristiche Avanzate**:
- **Workflow**: Ricerca → Pianificazione → Consenso → Esecuzione Wave → Verificazione
- **Coordinazione Esperti**: Consenso multi-agente con risoluzione conflitti
- **Validation Zero-Error**: Meccanismo di consenso per risultati perfetti
- **Apprendimento Adattivo**: Ottimizzazione basata su pattern di successo

**Flag Speciali**:
- `--dry-run`: Mostra piano completo senza esecuzione
- `--explain`: Spiega tutte le decisioni di orchestrazione
- `--max-complexity N`: Limita complessità massima
- `--override-safety`: Salta validazioni (solo emergenze)
- `--force-consensus`: Richiede consenso unanime (100%)
- `--learning-mode`: Modalità apprendimento enhanced

---

### `/index [query] [flags]`

🎯 **Scopo**: Navigazione e ricerca nel catalogo comandi

🤖 **Persona Auto-Attiva**: Mentor, Analyzer

🔗 **Integrazione MCP**: Sequential

💡 **Esempi**:
```bash
/index                        # Lista tutti i comandi
/index performance           # Cerca comandi per performance
/index git                   # Comandi Git
/index --category analysis   # Filtra per categoria
```

---

### `/load [path] [flags]`

🎯 **Scopo**: Caricamento intelligente del contesto di progetto

🤖 **Persona Auto-Attiva**: Analyzer, Architect, Scribe

🔗 **Integrazione MCP**: Tutti i server

💡 **Esempi**:
```bash
/load                         # Carica contesto progetto corrente
/load @monorepo/             # Carica contesto specifico
/load --deep                 # Caricamento approfondito
/load --cache                # Usa cache se disponibile
```

---

### `/spawn [mode] [flags]`

🎯 **Scopo**: Orchestrazione task complessi con coordinazione multi-dominio

🤖 **Persona Auto-Attiva**: Analyzer, Architect, DevOps

🔗 **Integrazione MCP**: Tutti i server

💡 **Esempi**:
```bash
/spawn parallel "build, test, lint"
/spawn sequential "migrate-db, update-api, test"
/spawn workflow "deploy-staging"
```

---

## 🎛️ FLAG AVANZATI & MODIFICATORI

### 🧠 Flag di Analisi e Pianificazione

- `--plan`: Mostra piano di esecuzione prima dell'operazione
- `--think`: Analisi multi-file (~4K tokens, attiva Sequential)
- `--think-hard`: Analisi architetturale profonda (~10K tokens)
- `--ultrathink`: Analisi critica sistema (~32K tokens, tutti i MCP)

### ⚡ Flag di Efficienza e Compressione

- `--uc` / `--ultracompressed`: Riduzione token 30-50% con simboli
- `--answer-only`: Risposta diretta senza workflow
- `--validate`: Validazione pre-operazione e valutazione rischi
- `--safe-mode`: Validazione massima con esecuzione conservativa
- `--verbose`: Dettaglio e spiegazioni massime

### 🔗 Flag Controllo Server MCP

- `--c7` / `--context7`: Abilita Context7 per documentazione librerie
- `--seq` / `--sequential`: Abilita Sequential per analisi complesse
- `--magic`: Abilita Magic per generazione componenti UI
- `--play` / `--playwright`: Abilita Playwright per automazione browser
- `--all-mcp`: Abilita tutti i server MCP contemporaneamente
- `--no-mcp`: Disabilita tutti i server MCP

### 🌊 Flag Orchestrazione Wave

- `--wave-mode [auto|force|off]`: Controlla attivazione orchestrazione wave
- `--wave-strategy [progressive|systematic|adaptive|enterprise]`: Strategia wave
- `--wave-delegation [files|folders|tasks]`: Controllo delegazione wave

### 👥 Flag Delegazione Sub-Agent

- `--delegate [files|folders|auto]`: Abilita delegazione task per elaborazione parallela
- `--concurrency [n]`: Controlla max sub-agent contemporanei (default: 7, range: 1-15)

### 🎯 Flag Focus e Scope

- `--scope [file|module|project|system]`: Livello di scope dell'analisi
- `--focus [performance|security|quality|architecture]`: Dominio di focus

### 🔄 Flag Miglioramento Iterativo

- `--loop`: Abilita modalità miglioramento iterativo
- `--iterations [n]`: Controlla numero cicli miglioramento (default: 3)
- `--interactive`: Abilita conferma utente tra iterazioni

### 👤 Flag Attivazione Persona

- `--persona-architect`: Specialista architettura sistemi
- `--persona-frontend`: Specialista UX e accessibilità
- `--persona-backend`: Ingegnere affidabilità, specialista API
- `--persona-analyzer`: Specialista root cause analysis
- `--persona-security`: Modellatore minacce, specialista vulnerabilità
- `--persona-mentor`: Specialista trasferimento conoscenze
- `--persona-refactorer`: Specialista qualità codice
- `--persona-performance`: Specialista ottimizzazione
- `--persona-qa`: Sostenitore qualità, specialista testing
- `--persona-devops`: Specialista infrastruttura
- `--persona-scribe=lang`: Scrittore professionale, specialista documentazione

### 🔍 Flag Introspezione e Trasparenza

- `--introspect` / `--introspection`: Modalità trasparenza profonda del processo di ragionamento

### 🚀 Flag Meta-Orchestrazione

- `--dry-run`: Mostra piano orchestrazione completo senza esecuzione
- `--explain`: Spiegazione dettagliata di tutte le decisioni di orchestrazione
- `--max-complexity [0.0-1.0]`: Limita punteggio massimo complessità
- `--override-safety`: Salta fase consenso e validazioni sicurezza (solo emergenze)
- `--force-consensus`: Richiede accordo unanime (100%) esperti
- `--learning-mode`: Apprendimento pattern enhanced e ottimizzazione

---

## 🎯 ESEMPI PRATICI D'USO

### 🚀 Scenari per Principianti

#### SuperClaude Framework (Intelligenza AI)
```bash
# Analisi base del progetto
/analyze

# Costruzione semplice
/build

# Miglioramento generale
/improve

# Creazione documentazione
/document readme
```

#### Tools (Utilità Veloci)
```bash
# Setup API veloce
/tool-api-scaffold "fastapi" "user auth"

# Spiegazione codice
/tool-code-explain "@src/payment.py"

# Onboarding nuovo sviluppatore
/tool-onboard "frontend-developer"

# Security scan base
/tool-security-scan "main components"
```

---

### 💼 Scenari Intermedi

#### SuperClaude Framework (AI Orchestration)
```bash
# Implementazione feature con ottimizzazione
/implement "user dashboard" --persona-frontend --magic

# Analisi performance approfondita
/analyze performance --think --focus performance

# Miglioramento iterativo
/improve code-quality --loop --iterations 5

# Test completi con coverage
/test --coverage --play
```

#### Workflows (Multi-Agent Coordination)
```bash
# Sviluppo feature completa
/workflow-feature-development "real-time notifications"

# Review multi-prospettiva
/workflow-full-review "@src/authentication"

# Risoluzione problemi sistematica
/workflow-smart-fix "API timeouts under load"

# Git workflow automatizzato
/workflow-git-workflow "release-preparation"
```

#### Tools (Specializzazione)
```bash
# Docker production-ready
/tool-docker-optimize "nodejs-api"

# Database migration sicura
/tool-db-migrate "add user preferences schema"

# Debug intelligente
/tool-smart-debug "memory leak in auth service"

# Monitoring setup completo
/tool-monitor-setup "microservices-cluster"
```

---

### 🏢 Scenari Avanzati

#### SuperClaude Framework (AI Orchestration)
```bash
# Orchestrazione completa con AI
/sc:auto "ottimizza completamente l'applicazione per performance e sicurezza"

# Analisi enterprise completa
/analyze --ultrathink --all-mcp --wave-mode force

# Refactoring sistematico grande scala
/improve --wave-strategy systematic --delegate folders --validate

# Deploy con validazione completa
/spawn workflow "full-deployment" --safe-mode --validate
```

#### Workflows (Enterprise Coordination)
```bash
# Modernizzazione sistema legacy
/workflow-legacy-modernize "monolithic PHP to microservices"

# Security hardening completo
/workflow-security-hardening "entire application stack"

# Performance optimization sistematica
/workflow-performance-optimization "slow database queries"

# Feature data-driven avanzata
/workflow-data-driven-feature "real-time analytics dashboard"
```

#### Tools (Enterprise Grade)
```bash
# AI assistant produzione
/tool-ai-assistant "customer support chatbot with ML"

# K8s manifests production-ready
/tool-k8s-manifest "high-availability web cluster"

# Compliance validation completa
/tool-compliance-check "GDPR + SOX combined audit"

# Cost optimization avanzata
/tool-cost-optimize "entire AWS infrastructure analysis"
```

---

### 🚨 Scenari di Emergenza

#### Incident Response Coordinate
```bash
# SuperClaude: Debug critico con massima analisi
/troubleshoot "production crash affecting 50% users" --ultrathink --override-safety

# Workflow: Incident response coordinato
/workflow-incident-response "database corruption detected"

# Tools: Smart debug emergency
/tool-smart-debug "payment gateway failing intermittently"
```

#### Security Critical
```bash
# SuperClaude: Fix sicurezza urgente
/sc:auto "urgent: fix SQL injection in user auth" --override-safety

# Workflow: Security hardening emergency
/workflow-security-hardening "compromised user data endpoint"

# Tools: Emergency security scan
/tool-security-scan "production API endpoints" --emergency-mode
```

#### Recovery Operations
```bash
# SuperClaude: Recovery da fallimento deploy
/git rollback --safe-mode --validate

# Workflow: Smart fix per problemi critici
/workflow-smart-fix "entire payment system down"

# Tools: Database recovery
/tool-db-migrate "rollback corrupted schema changes"
```

---

## 🗺️ QUICK REFERENCE - Navigazione Rapida

### 🧠 **SuperClaude Framework** (Quando hai bisogno di AI intelligente)
| Comando | Uso | Esempio |
|---------|-----|---------|
| `/sc:auto` | 🌟 Orchestratore AI definitivo | `"optimize entire app"` |
| `/analyze` | Analisi sistemica intelligente | `performance --think` |
| `/implement` | Sviluppo con AI reasoning | `"user auth system"` |
| `/improve` | Miglioramento evidence-based | `--loop --wave-mode` |
| `/build` | Build con framework detection | `--prod --optimize` |

### ⚡ **Workflows** (Quando hai bisogno di coordinazione multi-agente)
| Comando | Uso | Esempio |
|---------|-----|---------|
| `/workflow-feature-development` | 🚀 Feature completa coordinata | `"payment integration"` |
| `/workflow-full-review` | Review multi-prospettiva | `"security audit"` |
| `/workflow-smart-fix` | Problem solving sistematico | `"API performance issues"` |
| `/workflow-security-hardening` | Sicurezza enterprise | `"production systems"` |
| `/workflow-legacy-modernize` | Modernizzazione sistemi | `"PHP monolith"` |

### 🔧 **Tools** (Quando hai bisogno di task specifici)
| Comando | Uso | Esempio |
|---------|-----|---------|
| `/tool-api-scaffold` | ⚡ API setup veloce | `"fastapi" "user mgmt"` |
| `/tool-docker-optimize` | Container production | `"nodejs-app"` |
| `/tool-security-scan` | Security check | `"entire-codebase"` |
| `/tool-smart-debug` | Debug intelligente | `"memory leak"` |
| `/tool-monitor-setup` | Observability setup | `"web-application"` |

### 🎯 **Guida Scelta Rapida**

**🤔 Non sai quale usare?**
1. **Task generico/complesso** → `/sc:auto "[descrivi cosa vuoi]"`
2. **Feature nuova che richiede coordinazione** → `/workflow-feature-development`
3. **Task specifico e veloce** → `/tool-[categoria]`

**⚡ Velocità vs Potenza**
- **Veloce**: Tools (`/tool-*`) - specializzati, single-purpose
- **Bilanciato**: SuperClaude standard (`/analyze`, `/build`)
- **Potente**: SuperClaude Wave (`/sc:auto`, `/improve --wave-mode`)
- **Coordinato**: Workflows (`/workflow-*`) - multi-agent

**🎚️ Complessità progressiva**
1. **Principiante**: Tools base + SuperClaude semplice
2. **Intermedio**: Workflows + SuperClaude con flag
3. **Avanzato**: SuperClaude Wave + Workflow enterprise
4. **Expert**: `/sc:auto` con orchestrazione completa

---

## ⚡ COMANDI WORKFLOW - 14 Comandi

*Multi-agent orchestration per processi complessi coordinati*

### 🚀 **Feature Development & Review**

#### `/workflow-feature-development [feature-description]`

🎯 **Scopo**: Implementazione completa feature con orchestrazione multi-agente specializzata

🤖 **Agents**: backend-architect → frontend-developer → test-automator → deployment-engineer

⚡ **Complessità**: Alta - Coordinazione sequenziale multi-fase

💡 **Esempi**:
```bash
/workflow-feature-development "user authentication system"
/workflow-feature-development "real-time chat functionality"
/workflow-feature-development "payment integration with Stripe"
```

**Workflow**:
1. **Backend Architecture** → Design API e schema database
2. **Frontend Implementation** → Crea UI componenti basati su API
3. **Test Coverage** → Tests completi backend + frontend  
4. **Production Deployment** → CI/CD e monitoraggio

---

#### `/workflow-full-review [target]`

🎯 **Scopo**: Review multi-prospettiva completa con agenti specializzati

🤖 **Agents**: code-reviewer + security-auditor + architect-reviewer + performance-engineer + test-automator

⚡ **Complessità**: Alta - Analisi parallela multi-dominio

💡 **Esempi**:
```bash
/workflow-full-review "entire codebase"
/workflow-full-review "@src/api"
/workflow-full-review "authentication module"
```

**Analisi Parallele**:
- **Code Quality**: Clean code, maintainability, documentation
- **Security Audit**: OWASP, vulnerabilities, data protection
- **Architecture Review**: Scalability, design patterns, coupling
- **Performance Analysis**: Bottlenecks, optimization opportunities
- **Test Coverage**: Coverage gaps, test quality

---

### 🔧 **Development Process Automation**

#### `/workflow-git-workflow [operation]`

🎯 **Scopo**: Automazione completa workflow Git con best practices

🤖 **Agents**: devops-engineer + security-auditor + code-reviewer

⚡ **Complessità**: Media - Automazione processo

💡 **Esempi**:
```bash
/workflow-git-workflow "feature-branch-setup"
/workflow-git-workflow "pre-commit-validation"
/workflow-git-workflow "release-preparation"
```

---

#### `/workflow-smart-fix [problem-description]`

🎯 **Scopo**: Risoluzione intelligente problemi con approccio sistematico

🤖 **Agents**: debugger + performance-engineer + security-auditor (se necessario)

⚡ **Complessità**: Media-Alta - Problem solving coordinato

💡 **Esempi**:
```bash
/workflow-smart-fix "API response times are slow"
/workflow-smart-fix "memory leak in production"
/workflow-smart-fix "authentication randomly failing"
```

---

### 🏢 **Enterprise & Scaling**

#### `/workflow-legacy-modernize [system]`

🎯 **Scopo**: Modernizzazione sistemi legacy con strategia coordinata

🤖 **Agents**: legacy-modernizer + cloud-architect + security-auditor + deployment-engineer

⚡ **Complessità**: Molto Alta - Trasformazione sistema

💡 **Esempi**:
```bash
/workflow-legacy-modernize "monolithic PHP application"
/workflow-legacy-modernize "legacy database system"
/workflow-legacy-modernize "outdated authentication system"
```

---

#### `/workflow-security-hardening [scope]`

🎯 **Scopo**: Implementazione security-first con validation multi-livello

🤖 **Agents**: security-auditor + backend-architect + devops-engineer + compliance-checker

⚡ **Complessità**: Alta - Sicurezza enterprise

💡 **Esempi**:
```bash
/workflow-security-hardening "entire application"
/workflow-security-hardening "API endpoints"
/workflow-security-hardening "user data handling"
```

---

### 🎯 **Specialized Workflows**

#### `/workflow-performance-optimization [target]`

🎯 **Scopo**: Ottimizzazione performance sistematica multi-livello

🤖 **Agents**: performance-engineer + database-optimizer + frontend-developer + devops-engineer

⚡ **Complessità**: Alta - Ottimizzazione completa

💡 **Esempi**:
```bash
/workflow-performance-optimization "slow API endpoints"
/workflow-performance-optimization "frontend loading times"
/workflow-performance-optimization "database queries"
```

---

#### `/workflow-data-driven-feature [requirements]`

🎯 **Scopo**: Sviluppo feature data-driven con analytics integrate

🤖 **Agents**: data-engineer + backend-architect + frontend-developer + analytics-engineer

⚡ **Complessità**: Alta - Feature analytics-first

💡 **Esempi**:
```bash
/workflow-data-driven-feature "user behavior tracking dashboard"
/workflow-data-driven-feature "A/B testing framework"
/workflow-data-driven-feature "real-time analytics pipeline"
```

---

## 🔧 COMANDI TOOLS - 38 Comandi

*Utilità specializzate per tasks specifici e produttività istantanea*

### 🤖 **AI & Machine Learning**

#### `/tool-ai-assistant [requirements]`

🎯 **Scopo**: Sviluppo assistenti AI conversazionali con NLP avanzato

🛠️ **Specializzazione**: Chatbot, NLU, Dialog Management

⚡ **Complessità**: Alta - Sistema conversazionale completo

💡 **Esempi**:
```bash
/tool-ai-assistant "customer support chatbot"
/tool-ai-assistant "voice assistant for smart home"
/tool-ai-assistant "code review assistant"
```

**Features**: Architecture completa, NLP pipeline, response generation, context management, testing framework

---

#### `/tool-prompt-optimize [prompt-text]`

🎯 **Scopo**: Ottimizzazione prompt per LLM e sistemi AI

🛠️ **Specializzazione**: Prompt engineering, LLM optimization

⚡ **Complessità**: Media - Prompt refinement

💡 **Esempi**:
```bash
/tool-prompt-optimize "Generate code documentation"
/tool-prompt-optimize "Customer service response template"
/tool-prompt-optimize "Code review assistant prompt"
```

---

#### `/tool-langchain-agent [agent-type]`

🎯 **Scopo**: Creazione agenti LangChain specializzati con tool integration

🛠️ **Specializzazione**: Agent orchestration, tool calling

⚡ **Complessità**: Alta - Agent development

💡 **Esempi**:
```bash
/tool-langchain-agent "research assistant"
/tool-langchain-agent "code analysis agent"
/tool-langchain-agent "document processing agent"
```

---

### 🏗️ **Architecture & Code Quality**

#### `/tool-api-scaffold [framework] [requirements]`

🎯 **Scopo**: Scaffolding API production-ready con best practices integrate

🛠️ **Specializzazione**: API development, framework setup

⚡ **Complessità**: Media-Alta - Setup completo

💡 **Esempi**:
```bash
/tool-api-scaffold "fastapi" "user management system"
/tool-api-scaffold "express" "e-commerce backend"
/tool-api-scaffold "django" "content management API"
```

**Features**: Authentication, validation, testing, documentation, deployment setup

---

#### `/tool-code-explain [target]`

🎯 **Scopo**: Spiegazioni dettagliate codice con analisi architetturale

🛠️ **Specializzazione**: Code analysis, documentation

⚡ **Complessità**: Media - Analisi intelligente

💡 **Esempi**:
```bash
/tool-code-explain "@src/complex-algorithm.py"
/tool-code-explain "design patterns in use"
/tool-code-explain "microservices communication"
```

---

#### `/tool-refactor-clean [target]`

🎯 **Scopo**: Refactoring sistematico con clean code principles

🛠️ **Specializzazione**: Code quality, maintainability

⚡ **Complessità**: Media-Alta - Code transformation

💡 **Esempi**:
```bash
/tool-refactor-clean "legacy payment module"
/tool-refactor-clean "duplicate code elimination"
/tool-refactor-clean "SOLID principles implementation"
```

---

### 🗄️ **Data & Database**

#### `/tool-db-migrate [operation]`

🎯 **Scopo**: Migrazioni database sicure con rollback automatico

🛠️ **Specializzazione**: Database migrations, schema evolution

⚡ **Complessità**: Alta - Database management

💡 **Esempi**:
```bash
/tool-db-migrate "add user preferences table"
/tool-db-migrate "normalize product catalog"
/tool-db-migrate "update indexes for performance"
```

---

#### `/tool-data-pipeline [source] [destination]`

🎯 **Scopo**: Pipeline ETL robuste con monitoring integrato

🛠️ **Specializzazione**: Data engineering, ETL processes

⚡ **Complessità**: Alta - Data processing

💡 **Esempi**:
```bash
/tool-data-pipeline "user-events" "analytics-warehouse"
/tool-data-pipeline "api-logs" "elasticsearch"
/tool-data-pipeline "csv-files" "database-tables"
```

---

### 🚀 **DevOps & Infrastructure**

#### `/tool-docker-optimize [target]`

🎯 **Scopo**: Ottimizzazione Docker completa per produzione

🛠️ **Specializzazione**: Container optimization, build performance

⚡ **Complessità**: Alta - Production containers

💡 **Esempi**:
```bash
/tool-docker-optimize "node-app"
/tool-docker-optimize "python-api"
/tool-docker-optimize "multi-service setup"
```

**Features**: Multi-stage builds, security hardening, size optimization, performance tuning

---

#### `/tool-k8s-manifest [service-type]`

🎯 **Scopo**: Kubernetes manifests production-ready con security

🛠️ **Specializzazione**: Kubernetes, container orchestration

⚡ **Complessità**: Alta - K8s deployment

💡 **Esempi**:
```bash
/tool-k8s-manifest "web-application"
/tool-k8s-manifest "microservice"
/tool-k8s-manifest "database-cluster"
```

---

#### `/tool-deploy-checklist [environment]`

🎯 **Scopo**: Checklist deployment completa con validation automatica

🛠️ **Specializzazione**: Deployment validation, best practices

⚡ **Complessità**: Media - Deployment safety

💡 **Esempi**:
```bash
/tool-deploy-checklist "production"
/tool-deploy-checklist "staging"
/tool-deploy-checklist "first-deployment"
```

---

### 🔒 **Security & Compliance**

#### `/tool-security-scan [target]`

🎯 **Scopo**: Security scanning completo con remediation automatica

🛠️ **Specializzazione**: Vulnerability assessment, security hardening

⚡ **Complessità**: Alta - Security comprehensive

💡 **Esempi**:
```bash
/tool-security-scan "entire-codebase"
/tool-security-scan "docker-images"
/tool-security-scan "api-endpoints"
```

**Features**: OWASP compliance, vulnerability detection, fix recommendations, compliance reporting

---

#### `/tool-compliance-check [standard]`

🎯 **Scopo**: Compliance validation automatica con reporting

🛠️ **Specializzazione**: Regulatory compliance, standards validation

⚡ **Complessità**: Alta - Compliance automation

💡 **Esempi**:
```bash
/tool-compliance-check "GDPR"
/tool-compliance-check "SOX"
/tool-compliance-check "HIPAA"
```

---

### 🧪 **Testing & Quality**

#### `/tool-test-harness [test-type]`

🎯 **Scopo**: Framework testing completo con automation

🛠️ **Specializzazione**: Test automation, quality assurance

⚡ **Complessità**: Alta - Testing framework

💡 **Esempi**:
```bash
/tool-test-harness "api-testing"
/tool-test-harness "load-testing"
/tool-test-harness "e2e-testing"
```

---

### 🔍 **Debugging & Analysis**

#### `/tool-smart-debug [issue-description]`

🎯 **Scopo**: Debugging intelligente con root cause analysis

🛠️ **Specializzazione**: Problem resolution, debugging

⚡ **Complessità**: Alta - Intelligent debugging

💡 **Esempi**:
```bash
/tool-smart-debug "memory leak in user service"
/tool-smart-debug "intermittent API timeouts"
/tool-smart-debug "race condition in payment flow"
```

**Features**: Multi-approach debugging, performance profiling, solution options, implementation guide

---

#### `/tool-error-analysis [logs/errors]`

🎯 **Scopo**: Analisi sistematica errori con pattern recognition

🛠️ **Specializzazione**: Error analysis, log mining

⚡ **Complessità**: Media-Alta - Error intelligence

💡 **Esempi**:
```bash
/tool-error-analysis "production error logs"
/tool-error-analysis "recurring exceptions"
/tool-error-analysis "user reported issues"
```

---

### 📊 **Monitoring & Optimization**

#### `/tool-monitor-setup [service]`

🎯 **Scopo**: Monitoring e alerting completo per produzione

🛠️ **Specializzazione**: Observability, monitoring

⚡ **Complessità**: Alta - Full observability

💡 **Esempi**:
```bash
/tool-monitor-setup "web-application"
/tool-monitor-setup "microservices"
/tool-monitor-setup "database-cluster"
```

---

#### `/tool-cost-optimize [resource]`

🎯 **Scopo**: Ottimizzazione costi cloud con analisi dettagliata

🛠️ **Specializzazione**: Cloud optimization, cost management

⚡ **Complessità**: Media-Alta - Cost intelligence

💡 **Esempi**:
```bash
/tool-cost-optimize "AWS infrastructure"
/tool-cost-optimize "database usage"
/tool-cost-optimize "compute resources"
```

---

### 📚 **Documentation & Collaboration**

#### `/tool-doc-generate [target]`

🎯 **Scopo**: Documentazione automatica con standard professionali

🛠️ **Specializzazione**: Technical writing, documentation

⚡ **Complessità**: Media - Documentation automation

💡 **Esempi**:
```bash
/tool-doc-generate "API documentation"
/tool-doc-generate "user guide"
/tool-doc-generate "architecture overview"
```

---

#### `/tool-onboard [new-member-role]`

🎯 **Scopo**: Onboarding automatico per nuovi membri del team

🛠️ **Specializzazione**: Team onboarding, knowledge transfer

⚡ **Complessità**: Media - Onboarding automation

💡 **Esempi**:
```bash
/tool-onboard "frontend-developer"
/tool-onboard "devops-engineer"
/tool-onboard "product-manager"
```

---

## 🔗 INTEGRAZIONE INTELLIGENTE

### 🤖 Sistema Auto-Attivazione
Il sistema SuperClaude attiva automaticamente:
- **Personas specializzate** basate sul contesto
- **Server MCP appropriati** per funzionalità avanzate
- **Modalità Wave** per operazioni complesse
- **Validazioni di sicurezza** per operazioni critiche

### 🌊 Modalità Wave
Attivazione automatica quando:
- Complessità ≥ 0.7
- File coinvolti > 20
- Tipi di operazioni > 2

### 📊 Ottimizzazione Performance
- **Cache intelligente**: Riuso risultati analisi
- **Elaborazione parallela**: Sub-agent per task indipendenti
- **Compressione adattiva**: Ottimizzazione token automatica

---

## ❓ DOMANDE FREQUENTI

**Q: Ho 69 comandi... quale uso per iniziare?**
A: Dipende dal task:
- **Task generico**: `/sc:auto "[cosa vuoi fare]"` 
- **Setup veloce**: `/tool-api-scaffold` o `/tool-onboard`
- **Analisi progetto**: `/analyze`
- **Feature coordinata**: `/workflow-feature-development`

**Q: Qual è la differenza tra i tre sistemi?**
A: 
- **SuperClaude** (17): AI reasoning, wave mode, intelligence adattiva
- **Workflows** (14): Multi-agent coordination per processi complessi
- **Tools** (38): Utilità specializzate, single-purpose, velocità

**Q: Come faccio a sapere quale sistema usare?**
A:
- **Non sai cosa usare** → `/sc:auto`
- **Task specifico e veloce** → `/tool-*`
- **Feature che richiede coordinazione** → `/workflow-*`
- **Analisi/miglioramento complesso** → SuperClaude framework

**Q: Come funziona la modalità Wave nei SuperClaude?**
A: Si attiva automaticamente per operazioni complesse (≥0.7 complexity, >20 files), dividendo il lavoro in fasi coordinate per risultati ottimali.

**Q: Posso combinare comandi di sistemi diversi?**
A: I sistemi sono progettati per essere complementari:
- SuperClaude può invocare Tools tramite sub-agent delegation
- Workflows orchestrano sia SuperClaude che Tools
- `/sc:auto` può coordinare tutti e tre i sistemi

**Q: I Workflows sostituiscono SuperClaude?**
A: No! Sono complementari:
- **SuperClaude**: AI reasoning e intelligence
- **Workflows**: Coordinazione multi-agente
- Spesso i Workflows usano SuperClaude internamente

**Q: Come posso vedere cosa sta succedendo internamente?**
A: Usa `--introspect` sui comandi SuperClaude per vedere il processo di ragionamento completo.

**Q: Quale sistema è più veloce?**
A: **Tools** > **SuperClaude standard** > **Workflows** > **SuperClaude Wave**
Velocità vs Potenza: scegli in base alle tue esigenze.

---

## 🎓 SUGGERIMENTI PRO

### 🚀 **Strategia per Principianti**
1. **Inizia con Tools**: Impara i `/tool-*` per task specifici
2. **Sperimenta SuperClaude**: `/analyze` e `/build` per capire l'AI reasoning
3. **Prova `/sc:auto`**: Lascia che l'AI scelga tutto per te
4. **Esplora Workflows**: Quando hai progetti che richiedono coordinazione

### 💼 **Strategia per Intermedi**
1. **Combina sistemi intelligentemente**: Tools per setup, SuperClaude per reasoning, Workflows per coordinazione
2. **Sfrutta flag avanzati**: `--think`, `--wave-mode`, `--delegate`
3. **Usa personas specifiche**: `--persona-security`, `--persona-performance`
4. **Monitora con `--introspect`**: Impara dai processi decisionali

### 🏢 **Strategia per Esperti**
1. **Orchestrazione completa**: `/sc:auto` come centro di controllo
2. **Workflow enterprise**: Usa `/workflow-legacy-modernize`, `/workflow-security-hardening`
3. **Combinazioni avanzate**: SuperClaude Wave + Workflow coordination + Tools specialization
4. **Customizzazione flags**: Crea tue combinazioni di flag per workflow specifici

### ⚡ **Tips di Performance**
- **Cache intelligente**: I comandi SuperClaude riutilizzano analisi
- **Delegazione parallela**: Usa `--delegate` per task grandi
- **Compressione adattiva**: `--uc` per ottimizzazione token
- **Batch operations**: Combina operazioni correlate

### 🎯 **Best Practices**
1. **Task semplici** → Tools (`/tool-*`)
2. **Task complessi** → SuperClaude (`/sc:auto`)
3. **Progetti coordinati** → Workflows (`/workflow-*`)
4. **Emergenze** → SuperClaude con `--override-safety`
5. **Learning** → Sempre `--introspect` per capire i processi

### 🔄 **Workflow Ottimali**
- **New Project**: `/tool-api-scaffold` → `/workflow-feature-development` → `/sc:auto "optimize"`
- **Debug Session**: `/tool-smart-debug` → `/workflow-smart-fix` → `/analyze --think`
- **Security Audit**: `/tool-security-scan` → `/workflow-security-hardening` → `/sc:auto "harden"`
- **Performance**: `/analyze performance` → `/tool-monitor-setup` → `/workflow-performance-optimization`

---

## 🏆 CONCLUSIONE

Hai ora accesso a **69 comandi specializzati** organizzati in **3 sistemi complementari**:

- **🧠 17 SuperClaude**: AI reasoning e intelligence adattiva
- **⚡ 14 Workflows**: Multi-agent coordination per processi complessi  
- **🔧 38 Tools**: Utilità specializzate per produttività istantanea

**💡 Ricorda**: Claude Code è progettato per essere intelligente e adattivo. Inizia con comandi semplici, sperimenta con `/sc:auto`, e gradualmente esplora l'intero ecosistema. Ogni sistema è progettato per complementare gli altri - usa la combinazione giusta per il tuo workflow!

**🚀 Quick Start**: Se non sai da dove iniziare, digita `/sc:auto "[descrivi cosa vuoi fare]"` e lascia che l'AI orchestri tutto per te!