import { expect, test } from "@playwright/test";

test("theme follows the system until selected, then survives navigation and reload", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Kunduzgi rejim", exact: true })).toHaveAttribute("aria-pressed", "true");

  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Kunduzgi rejim", exact: true }).click();
  await page.locator(".sidebar").getByRole("link", { name: "Kutubxona", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(243, 246, 251)");

  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Tungi rejim", exact: true }).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Tungi rejim", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("theme changes sync between tabs", async ({ page, context }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Kunduzgi rejim", exact: true }).click();
  const other = await context.newPage();
  await other.goto("./filmlar/");
  await expect(other.locator("html")).toHaveAttribute("data-theme", "light");
  await other.getByRole("button", { name: "Tungi rejim", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await other.evaluate(() => localStorage.removeItem("armytv-theme"));
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await other.close();
});

test("saved light mode is painted even before application JavaScript loads", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("armytv-theme", "light"));
  await page.route("**/_next/static/**/*.js", route => route.abort());
  await page.goto("./", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(243, 246, 251)");
});

test("invalid preferences and unavailable storage still allow switching", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.addInitScript(() => localStorage.setItem("armytv-theme", "invalid"));
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error("Storage unavailable"); };
    Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); };
  });
  await page.reload();
  await page.getByRole("button", { name: "Tungi rejim", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Kunduzgi rejim", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("light mode covers every section and the switch fits small screens", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of ["./", "./filmlar/", "./tarjima/", "./bolalar/", "./kutubxona/", "./talim/", "./testlar/", "./yangiliklar/", "./saqlanganlar/", "./obuna/", "./jonli-efir/", "./film/chegarachi/"]) {
    expect((await page.goto(route))?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".sidebar")).toHaveCSS("background-color", "rgb(255, 255, 255)");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  }
  await page.goto("./");
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    const toggle = page.getByRole("group", { name: "Sayt ko‘rinishi" });
    await expect(toggle).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const actions = await page.locator(".hero-actions").boundingBox();
    const carousel = await page.locator(".hero-bottom").boundingBox();
    expect(actions).not.toBeNull();
    expect(carousel).not.toBeNull();
    expect(actions!.y + actions!.height).toBeLessThan(carousel!.y);
    await page.getByRole("button", { name: "Tungi rejim", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Kunduzgi rejim", exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  }
  expect(errors).toEqual([]);
});
