import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from '@axe-core/playwright';

test.describe('Performance Tests @performance', () => {
  test.beforeEach(async ({ page }) => {
    // Vai alla homepage
    await page.goto('/');
  });

  test('Core Web Vitals - FCP, LCP, CLS', async ({ page }) => {
    // Attendi che la pagina sia completamente caricata
    await page.waitForLoadState('networkidle');

    // Misurazione delle Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals: Record<string, number> = {};
        
        // Osserva le performance metrics
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
              if (entry.name === 'first-contentful-paint') {
                vitals.fcp = entry.startTime;
              }
            }
            if (entry.entryType === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls = (vitals.cls || 0) + (entry as any).value;
            }
          }
        });
        
        observer.observe({ type: 'paint', buffered: true });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
        observer.observe({ type: 'layout-shift', buffered: true });
        
        // Risolvi dopo 3 secondi per raccogliere le metriche
        setTimeout(() => resolve(vitals), 3000);
      });
    });

    // Verifica che le metriche rispettino i Core Web Vitals
    expect(vitals.fcp).toBeLessThan(1800); // FCP < 1.8s (Good)
    expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s (Good)
    expect(vitals.cls || 0).toBeLessThan(0.1); // CLS < 0.1 (Good)
  });

  test('Tempo di caricamento pagina', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Verifica che la pagina si carichi in meno di 3 secondi
    expect(loadTime).toBeLessThan(3000);
    console.log(`Tempo di caricamento: ${loadTime}ms`);
  });

  test('Dimensione bundle JavaScript', async ({ page }) => {
    // Intercetta le richieste di file JavaScript
    const jsResources: Array<{ url: string; size: number }> = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('.js') && response.status() === 200) {
        const headers = response.headers();
        const contentLength = headers['content-length'];
        if (contentLength) {
          jsResources.push({
            url,
            size: parseInt(contentLength, 10)
          });
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Calcola la dimensione totale del bundle JS
    const totalJSSize = jsResources.reduce((total, resource) => total + resource.size, 0);
    const totalJSSizeKB = totalJSSize / 1024;
    
    console.log(`Dimensione totale JS: ${totalJSSizeKB.toFixed(2)} KB`);
    console.log('File JS caricati:', jsResources.map(r => `${r.url.split('/').pop()}: ${(r.size / 1024).toFixed(2)} KB`));
    
    // Verifica che il bundle non superi 500KB
    expect(totalJSSizeKB).toBeLessThan(500);
  });

  test('Accessibilità (a11y)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Inietta axe-core
    await injectAxe(page);
    
    // Esegui il check di accessibilità
    await checkA11y(page, null, {
      detailedReport: true,
      detailedReportOptions: { html: true }
    });
  });

  test('Performance su dispositivi mobile', async ({ page, browserName }) => {
    // Simula un dispositivo mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.emulateMedia({ media: 'screen' });
    
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Su mobile, il tempo di caricamento può essere leggermente più alto
    expect(loadTime).toBeLessThan(5000);
    console.log(`Tempo di caricamento mobile (${browserName}): ${loadTime}ms`);
  });

  test('Verifica lazy loading delle immagini', async ({ page }) => {
    await page.goto('/');
    
    // Controlla che le immagini abbiano l'attributo loading="lazy"
    const images = await page.$$('img');
    
    for (const img of images) {
      const loading = await img.getAttribute('loading');
      const src = await img.getAttribute('src');
      
      // Le immagini dovrebbero avere loading="lazy" tranne quelle above-the-fold
      if (src && !src.includes('hero') && !src.includes('logo')) {
        expect(loading).toBe('lazy');
      }
    }
  });

  test('First Input Delay (FID) simulation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Simula un click su un elemento interattivo
    const startTime = Date.now();
    await page.click('button, a, [role="button"]').catch(() => {
      // Se non ci sono elementi cliccabili, skip il test
      console.log('Nessun elemento interattivo trovato');
    });
    const responseTime = Date.now() - startTime;
    
    // FID dovrebbe essere < 100ms per essere considerato "Good"
    expect(responseTime).toBeLessThan(100);
  });
});