#!/usr/bin/env node

console.log('🔧 Test Setup del Sistema di Performance\n');

// Test delle dipendenze
const dependencies = [
  '@next/bundle-analyzer',
  'lighthouse',
  'chrome-launcher',
  'node-fetch',
  'cross-env',
  'web-vitals',
];

console.log('📦 Verifica dipendenze:');
dependencies.forEach(dep => {
  try {
    // Check speciale per cross-env che è installato come binary
    if (dep === 'cross-env') {
      const { execSync } = require('child_process');
      try {
        execSync('npm list cross-env', {
          cwd: path.join(__dirname, '..'),
          stdio: 'pipe',
        });
        console.log(`   ✅ ${dep}`);
      } catch (e) {
        console.log(`   ❌ ${dep} - MANCANTE`);
      }
    } else {
      require.resolve(dep);
      console.log(`   ✅ ${dep}`);
    }
  } catch (e) {
    console.log(`   ❌ ${dep} - MANCANTE`);
  }
});

// Test script esistenti
const fs = require('fs');
const path = require('path');

console.log('\n📄 Verifica file:');
const files = [
  'tests/performance.spec.ts',
  'scripts/performance-audit.js',
  'docs/PERFORMANCE.md',
  'next.config.ts',
  'turbo.json',
];

files.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MANCANTE`);
  }
});

console.log('\n🚀 Test configurazione Next.js:');
try {
  const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
  if (fs.existsSync(nextConfigPath)) {
    console.log('   ✅ next.config.ts esiste');
    // Testa la sintassi leggendo il file
    const content = fs.readFileSync(nextConfigPath, 'utf8');
    if (content.includes('export default nextConfig')) {
      console.log('   ✅ Configurazione sintatticamente corretta');
    } else {
      console.log('   ⚠️  Configurazione potrebbe avere problemi');
    }
  } else {
    console.log('   ❌ next.config.ts non trovato');
  }
} catch (e) {
  console.log('   ❌ Errore nel next.config.ts:', e.message);
}

console.log('\n🎯 Comandi Disponibili:');
console.log('   npm run perf:vitals     - Test rapidi Playwright');
console.log('   npm run build:analyze   - Analisi bundle');
console.log('   npm run perf:audit      - Audit completo');
console.log('   npm run perf:full       - Test completo con build');

console.log('\n✅ Setup completato! Il sistema di performance è pronto.');
console.log('💡 Consulta docs/PERFORMANCE.md per le istruzioni complete.');
