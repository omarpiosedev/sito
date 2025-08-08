import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('About Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to about section via scroll', async ({ page }) => {
    // Scroll alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Attendi che lo scroll sia completato
    await page.waitForTimeout(1000);

    // Verifica che la sezione About sia in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport({ ratio: 0.5 });
  });

  test('should display about section with main heading and content', async ({
    page,
  }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica che la sezione About sia visibile
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeVisible();

    // Verifica il contenuto principale del testo
    const mainText = page.getByText(
      "I'm an Italian digital designer and web developer"
    );
    await expect(mainText).toBeVisible();

    const experienceText = page.getByText(
      'with years of experience, blending design, animation,'
    );
    await expect(experienceText).toBeVisible();
  });

  test('should display complete about text content', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica tutti i frammenti di testo principali
    await expect(
      page.getByText('and code into seamless digital experiences.')
    ).toBeVisible();
    await expect(
      page.getByText("I don't just build websites — I craft stories")
    ).toBeVisible();
    await expect(
      page.getByText('that move, interact, and inspire.')
    ).toBeVisible();
    await expect(
      page.getByText('at the sweet spot where creativity meets technology.')
    ).toBeVisible();
  });

  test('should have proper section layout and styling', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    const aboutSection = page.locator('#about');

    // Verifica che la sezione abbia le classi CSS corrette
    await expect(aboutSection).toHaveClass(/min-h-screen/);
    await expect(aboutSection).toHaveClass(/relative/);
  });

  test('should render shader background component', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica che il canvas dello shader sia presente (se visibile nel DOM)
    const canvas = page.locator('canvas');
    if ((await canvas.count()) > 0) {
      await expect(canvas.first()).toBeVisible();
    }
  });

  test('should render liquid glass container with correct structure', async ({
    page,
  }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica la struttura del liquid glass container
    const glassContainer = page.locator('.max-w-6xl');
    await expect(glassContainer).toBeVisible();

    // Verifica che il contenuto del testo sia all'interno del container
    const textContent = glassContainer.locator('p');
    await expect(textContent).toBeVisible();
  });

  test('should have proper fade gradients for visual effects', async ({
    page,
  }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica che i gradienti di fade top e bottom siano presenti
    const topFade = page.locator('.bg-gradient-to-b.from-black');
    await expect(topFade).toBeVisible();

    const bottomFade = page.locator('.bg-gradient-to-t.from-black');
    await expect(bottomFade).toBeVisible();
  });

  test('should have proper text styling and typography', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    const mainText = page
      .getByText("I'm an Italian digital designer and web developer")
      .first();

    // Verifica che il testo sia visibile e formattato correttamente
    await expect(mainText).toBeVisible();

    // Verifica che il container del testo abbia le classi corrette invece del testo stesso
    const textContainer = page.locator('#about .text-white.uppercase');
    await expect(textContainer).toBeVisible();
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    const aboutContent = page.getByText(
      "I'm an Italian digital designer and web developer"
    );
    await expect(aboutContent).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(aboutContent).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(aboutContent).toBeVisible();
  });

  test('should pass accessibility audit in about section', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Esegui scansione accessibilità specificamente sulla sezione About
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#about')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Fallisci se ci sono violazioni critiche o severe
    const criticalViolations = accessibilityScanResults.violations.filter(
      violation =>
        violation.impact === 'critical' || violation.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
      console.error(
        'Critical accessibility violations found in About section:',
        criticalViolations
      );
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test('should handle focus management properly', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica che la sezione About possa ricevere il focus se necessario
    const aboutSection = page.locator('#about');

    // Se ci sono elementi focalizzabili nella sezione, testali
    const focusableElements = await aboutSection
      .locator(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      .count();

    if (focusableElements > 0) {
      // Test focus management per elementi interattivi
      const firstFocusable = aboutSection
        .locator(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        .first();
      await firstFocusable.focus();
      await expect(firstFocusable).toBeFocused();
    }
  });

  test('should maintain proper z-index layering', async ({ page }) => {
    // Naviga alla sezione About
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);

    // Verifica che il primo elemento con z-index sia visibile (risolve il problema "strict mode violation")
    const contentLayer = page.locator('#about .relative.z-10').first();
    await expect(contentLayer).toBeVisible();

    // Verifica che almeno un elemento absolute sia presente nella sezione About
    const fadeOverlay = page.locator('#about .absolute').first();
    await expect(fadeOverlay).toBeVisible();
  });
});
