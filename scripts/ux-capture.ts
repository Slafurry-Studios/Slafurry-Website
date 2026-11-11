import { chromium, type Page } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

const tasks: Record<string, (page: Page, shot: (name: string) => Promise<void>) => Promise<void>> = {
  'homepage': async (page, shot) => {
    await page.goto(`${BASE}/`); await shot('01-home');
    await page.getByRole('link', { name: /games/i }).first().click(); await shot('02-games-nav');
    const gameLink = page.getByRole('link', { name: /\w+/i }).first();
    if (await gameLink.count()) {
      await gameLink.click(); await shot('03-game-detail');
    } else {
      await shot('03-games-empty');
    }
  },

  'blog-read': async (page, shot) => {
    await page.goto(`${BASE}/`); await shot('01-home');
    await page.getByRole('link', { name: /blog|devlog/i }).first().click().catch(() => {}); await shot('02-blog-nav');
    const postLink = page.getByRole('link', { name: /\w+/i }).first();
    if (await postLink.count()) {
      await postLink.click(); await shot('03-post-detail');
    } else {
      await shot('03-blog-empty');
    }
  },

  'contact-submit': async (page, shot) => {
    await page.goto(`${BASE}/contact`); await shot('01-contact-form');
    await page.getByLabel('Name').fill('UX Reviewer').catch(() => {});
    await page.getByLabel('Email').fill('review@example.com').catch(() => {});
    await page.getByLabel('Message').fill('This is a heuristic review test.').catch(() => {});
    await page.getByRole('button', { name: /submit|send/i }).click().catch(() => {});
    await page.waitForTimeout(1000);
    await shot('02-contact-submit');
    await shot('03-contact-result');
  },

  'admin-login': async (page, shot) => {
    await page.goto(`${BASE}/admin`); await shot('01-admin-redirect');
    await shot('02-admin-login');
    await page.getByLabel('Your email').fill('invalid@example.com').catch(() => {});
    await page.getByLabel('Password').fill('wrong').catch(() => {});
    await page.getByRole('button', { name: /sign in/i }).click().catch(() => {});
    await page.waitForTimeout(1000);
    await shot('03-admin-login-fail');
  },

  'admin-create-game': async (page, shot) => {
    await page.goto(`${BASE}/admin`); await shot('01-admin-redirect');
    await shot('02-admin-login');
    await page.getByLabel('Your email').fill('invalid@example.com').catch(() => {});
    await page.getByLabel('Password').fill('wrong').catch(() => {});
    await page.getByRole('button', { name: /sign in/i }).click().catch(() => {});
    await page.waitForTimeout(1000);
    await shot('03-admin-login-fail');
    await page.goto(`${BASE}/admin/games`); await shot('04-admin-games-protected');
    await page.goto(`${BASE}/admin`); await shot('05-admin-dashboard');
  },
};

async function main() {
  const browser = await chromium.launch();
  for (const [vpName, viewport] of Object.entries(viewports)) {
    const page = await browser.newPage({ viewport, isMobile: vpName === 'mobile', hasTouch: vpName === 'mobile' });
    page.on('console', (m) => m.type() === 'error' && console.log(`[${vpName}] console error: ${m.text()}`));
    for (const [task, run] of Object.entries(tasks)) {
      const shot = (name: string) => page.screenshot({ path: `ux-review/${vpName}/${task}/${name}.png`, fullPage: true }).then(() => {});
      try { await run(page, shot); } catch (e: unknown) { console.log(`[${vpName}] ${task} blocked: ${e instanceof Error ? e.message : String(e)}`); }
    }
    await page.close();
  }
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
