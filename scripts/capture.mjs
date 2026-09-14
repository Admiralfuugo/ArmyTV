import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const destination = process.env.ARMTV_SCREENSHOTS || join(tmpdir(), 'armytv-review');
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1080 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(baseURL, { waitUntil: 'networkidle' });
await page.screenshot({ path: `${destination}/desktop.png`, fullPage: true, animations: "disabled" });
console.log(JSON.stringify({ title: await page.title(), errors, brokenImages: await page.locator('img').evaluateAll(images => images.filter(image => !image.complete || image.naturalWidth === 0).map(image => image.src)) }));
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: `${destination}/mobile.png`, fullPage: true, animations: "disabled" });
await page.screenshot({ path: `${destination}/mobile-viewport.png`, animations: "disabled" });
console.log(JSON.stringify({ mobileWidth: await page.evaluate(() => document.documentElement.scrollWidth) }));
for (const section of ['kutubxona', 'talim', 'testlar', 'filmlar', 'jonli-efir', 'bolalar', 'obuna']) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseURL}/${section}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${destination}/${section}.png`, fullPage: true, animations: "disabled" });
  console.log(`${section}: ${await page.title()}`);
  if (['kutubxona', 'talim', 'testlar'].includes(section)) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${destination}/${section}-mobile.png`, animations: "disabled" });
  }
}
console.log(JSON.stringify({ errors, destination }));
await browser.close();
