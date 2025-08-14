#!/usr/bin/env node

const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runPerformanceAudit() {
  const url = process.env.URL || 'http://localhost:3000';

  console.log(`🚀 Avvio audit delle performance per: ${url}`);

  try {
    // Lancia Chrome
    const chrome = await chromeLauncher.launch({
      chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
    });

    // Configurazione Lighthouse
    const options = {
      logLevel: 'info',
      output: ['json', 'html'],
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      settings: {
        formFactor: 'desktop',
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };

    // Esegui l'audit
    const runnerResult = await lighthouse(url, options);

    // Ottieni i risultati
    const reportHtml = runnerResult.report[1];
    const reportJson = JSON.parse(runnerResult.report[0]);

    // Crea directory dei report se non esiste
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Salva i report
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlPath = path.join(reportsDir, `lighthouse-${timestamp}.html`);
    const jsonPath = path.join(reportsDir, `lighthouse-${timestamp}.json`);

    fs.writeFileSync(htmlPath, reportHtml);
    fs.writeFileSync(jsonPath, JSON.stringify(reportJson, null, 2));

    // Estrai le metriche principali
    const lhr = runnerResult.lhr;
    const scores = {
      performance: Math.round(lhr.categories.performance.score * 100),
      accessibility: Math.round(lhr.categories.accessibility.score * 100),
      bestPractices: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
    };

    const metrics = {
      fcp: lhr.audits['first-contentful-paint'].displayValue,
      lcp: lhr.audits['largest-contentful-paint'].displayValue,
      tbt: lhr.audits['total-blocking-time'].displayValue,
      cls: lhr.audits['cumulative-layout-shift'].displayValue,
      si: lhr.audits['speed-index'].displayValue,
    };

    // Mostra i risultati nella console
    console.log('\n📊 RISULTATI AUDIT PERFORMANCE\n');
    console.log('🏆 PUNTEGGI:');
    console.log(`   Performance: ${scores.performance}%`);
    console.log(`   Accessibility: ${scores.accessibility}%`);
    console.log(`   Best Practices: ${scores.bestPractices}%`);
    console.log(`   SEO: ${scores.seo}%`);

    console.log('\n⚡ CORE WEB VITALS:');
    console.log(`   First Contentful Paint (FCP): ${metrics.fcp}`);
    console.log(`   Largest Contentful Paint (LCP): ${metrics.lcp}`);
    console.log(`   Total Blocking Time (TBT): ${metrics.tbt}`);
    console.log(`   Cumulative Layout Shift (CLS): ${metrics.cls}`);
    console.log(`   Speed Index: ${metrics.si}`);

    console.log('\n📁 REPORT SALVATI:');
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   JSON: ${jsonPath}`);

    // Controlla se i risultati sono accettabili
    const warnings = [];
    if (scores.performance < 90)
      warnings.push(`Performance score basso: ${scores.performance}%`);
    if (scores.accessibility < 95)
      warnings.push(`Accessibility score basso: ${scores.accessibility}%`);
    if (scores.bestPractices < 90)
      warnings.push(`Best practices score basso: ${scores.bestPractices}%`);
    if (scores.seo < 95) warnings.push(`SEO score basso: ${scores.seo}%`);

    if (warnings.length > 0) {
      console.log('\n⚠️  AREE DI MIGLIORAMENTO:');
      warnings.forEach(warning => console.log(`   • ${warning}`));
    } else {
      console.log('\n✅ Ottimi risultati! Il sito rispetta tutti i benchmark.');
    }

    await chrome.kill();

    // Exit code basato sui risultati
    const overallGood =
      scores.performance >= 90 &&
      scores.accessibility >= 95 &&
      scores.bestPractices >= 90 &&
      scores.seo >= 95;
    process.exit(overallGood ? 0 : 1);
  } catch (error) {
    console.error("❌ Errore durante l'audit:", error);
    process.exit(1);
  }
}

// Verifica se il server è in esecuzione
async function checkServer(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  const url = process.env.URL || 'http://localhost:3000';

  console.log('🔍 Verifica che il server sia in esecuzione...');
  const serverRunning = await checkServer(url);

  if (!serverRunning) {
    console.error(`❌ Server non raggiungibile su ${url}`);
    console.log(
      '💡 Assicurati che il server sia in esecuzione con: npm run dev o npm run start'
    );
    process.exit(1);
  }

  await runPerformanceAudit();
}

if (require.main === module) {
  main();
}

module.exports = { runPerformanceAudit };
