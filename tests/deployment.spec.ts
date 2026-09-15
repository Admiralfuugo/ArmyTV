import { expect, test } from "@playwright/test";

test("exported pages load assets, navigate and reload under the deployment path", async ({ page, baseURL }) => {
  const siteURL = new URL(baseURL!);
  const failedResponses: string[] = [];
  const outsideSite: string[] = [];
  const runtimeErrors: string[] = [];

  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.origin === siteURL.origin && response.status() >= 400) {
      failedResponses.push(`${response.status()} ${url.pathname}`);
    }
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin === siteURL.origin && !url.pathname.startsWith(siteURL.pathname)) {
      outsideSite.push(url.pathname);
    }
  });
  page.on("pageerror", (error) => runtimeErrors.push(error.message));

  expect((await page.goto("./"))?.status()).toBe(200);
  await expect(page.locator(".hero-art img")).toBeVisible();
  await expect.poll(() => page.locator(".hero-art img").evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect.poll(() => page.locator(".sidebar").evaluate((element) => getComputedStyle(element).position)).toBe("fixed");

  await page.locator(".sidebar").getByRole("link", { name: "Filmlar va seriallar", exact: true }).click();
  await expect(page).toHaveURL(new URL("filmlar/", siteURL).href);
  await page.getByRole("link", { name: "Vatan haqida", exact: true }).click();
  await expect(page).toHaveURL(new URL("film/vatan/", siteURL).href);
  expect((await page.reload())?.status()).toBe(200);
  await expect(page.getByRole("heading", { name: "Vatan", exact: true })).toBeVisible();
  await expect(page.locator(".detail-hero-art")).toHaveCSS("background-image", `url("${new URL("images/vatan.jpg", siteURL).href}")`);
  await page.getByRole("link", { name: "Katalogga qaytish" }).click();
  await expect(page).toHaveURL(new URL("filmlar/", siteURL).href);

  expect(failedResponses).toEqual([]);
  expect(outsideSite).toEqual([]);
  expect(runtimeErrors).toEqual([]);

  expect((await page.goto("./mavjud-emas/"))?.status()).toBe(404);
});
