import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with main content', async ({ page }) => {
    // Verifica che la sezione hero sia visibile
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();

    // Verifica che l'immagine hero sia presente con attributi corretti
    const heroImage = page.getByRole('img', { name: 'Hero Image' });
    await expect(heroImage).toBeVisible();
    await expect(heroImage).toHaveAttribute('alt', 'Hero Image');
    await expect(heroImage).toHaveAttribute('src', /hero-image\.png/);
  });

  test('should display call-to-action text', async ({ page }) => {
    // Verifica la presenza del testo CTA
    const ctaText = page.getByText('AN INDEPENDENT CREATIVE WEB DEVELOPER');
    await expect(ctaText).toBeVisible();

    const locationText = page.getByText('BASED IN ITALY');
    await expect(locationText).toBeVisible();
  });

  test('should display scrolling text animation', async ({ page }) => {
    // Verifica che il testo scrollante sia presente
    const scrollingText = page.getByText('OMARPIOSELLI').first();
    await expect(scrollingText).toBeVisible();
  });

  test('should have proper fade gradients for visual effects', async ({
    page,
  }) => {
    // Verifica che i gradienti di fade siano presenti
    const leftFade = page.locator(
      '.bg-gradient-to-r.from-black.to-transparent'
    );
    await expect(leftFade).toBeVisible();

    const rightFade = page.locator(
      '.bg-gradient-to-l.from-black.to-transparent'
    );
    await expect(rightFade).toBeVisible();
  });

  test('should scroll to about section when clicking/scrolling', async ({
    page,
  }) => {
    // Verifica che la sezione About esista
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeAttached();

    // Scroll alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Attendi che lo scroll sia completato e verifica che About sia in viewport
    await page.waitForTimeout(1000);
    await expect(aboutSection).toBeInViewport({ ratio: 0.3 });
  });

  test('should have proper layout and positioning', async ({ page }) => {
    // Verifica che la sezione hero abbia le classi CSS corrette
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveClass(/min-h-screen/);
    await expect(heroSection).toHaveClass(/bg-black/);
    await expect(heroSection).toHaveClass(/relative/);
    await expect(heroSection).toHaveClass(/overflow-hidden/);
  });

  test('should pass accessibility audit', async ({ page }) => {
    // Esegui scansione accessibilità con axe-core
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Fallisci se ci sono violazioni critiche o severe
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation =>
        violation.impact === 'critical' || violation.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.error(
        'Critical accessibility violations found:',
        criticalViolations
      );
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const heroImage = page.getByRole('img', { name: 'Hero Image' });
    await expect(heroImage).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heroImage).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(heroImage).toBeVisible();
  });

  test('should have proper meta information', async ({ page }) => {
    // Verifica il titolo della pagina (usa il titolo attuale o un pattern più generico)
    await expect(page).toHaveTitle(/Create Next App|sito/);
  });
});
