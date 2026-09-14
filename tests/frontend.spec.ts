import { expect, test } from "@playwright/test";

test("search finds films, books, and courses and handles missing results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Qidirish", exact: true }).click();
  const search = page.getByRole("textbox", { name: "Qidiruv matni" });
  await search.fill("Chegarachi");
  await expect(page.getByRole("dialog").getByRole("link", { name: /Chegarachi/ })).toBeVisible();
  await search.fill("Temur");
  await expect(page.getByRole("dialog").getByRole("link", { name: /Temur tuzuklari/ })).toHaveCount(2);
  await search.fill("Ingliz");
  await expect(page.getByRole("dialog").getByRole("link", { name: /Ingliz tili/ })).toBeVisible();
  await search.fill("O'tkan");
  await expect(page.getByRole("dialog").getByRole("link", { name: /O‘tkan kunlar/ })).toBeVisible();
  await search.fill("zzzzzzzzzz");
  await expect(page.getByText("Hech narsa topilmadi", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("catalog filters and saved films persist after reload", async ({ page }) => {
  await page.goto("/filmlar/");
  await page.getByRole("button", { name: "Seriallar", exact: true }).click();
  await expect(page.locator(".catalog-grid .catalog-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Barchasi", exact: true }).click();
  await page.getByRole("textbox", { name: "Katalogdan qidirish" }).fill("Vatan");
  await expect(page.locator(".catalog-grid .catalog-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Vatanni saqlash", exact: true }).click({ force: true });
  await page.goto("/saqlanganlar/");
  await expect(page.locator(".catalog-grid .catalog-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".catalog-card-title")).toHaveText("Vatan");
  await page.getByRole("button", { name: "Vatanni saqlanganlardan olib tashlash" }).click({ force: true });
  await expect(page.getByRole("heading", { name: "Sevimlilaringizni shu yerda jamlang" })).toBeVisible();
});

test("sample video loads and plays", async ({ page }) => {
  await page.goto("/film/vatan/");
  await page.getByRole("button", { name: "Tomosha qilish", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const video = page.locator("video");
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.readyState)).toBeGreaterThanOrEqual(2);
  await video.evaluate(async (node: HTMLVideoElement) => { node.muted = true; await node.play(); });
  await expect.poll(() => video.evaluate((node: HTMLVideoElement) => node.currentTime)).toBeGreaterThan(0.3);
  await expect(video).toHaveJSProperty("error", null);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("library filters, opens a reader and retains a book bookmark", async ({ page }) => {
  await page.goto("/kutubxona/");
  await page.getByRole("button", { name: "Matbuot", exact: true }).click();
  await expect(page.locator(".learn-book-card")).toHaveCount(2);
  await page.getByRole("button", { name: "Vatanparvar — o‘qish", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("NAMUNA SON");
  await page.getByRole("button", { name: "Keyinroq o‘qish uchun saqlash" }).click();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByRole("button", { name: "Vatanparvar: saqlanganlardan olib tashlash", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("completed lessons persist and next lesson can be opened", async ({ page }) => {
  await page.goto("/talim/");
  await page.getByRole("button", { name: "Ingliz tili: ilk qadam kursini ochish" }).click();
  await expect(page.getByRole("dialog")).toContainText("Salomlashish va tanishish");
  await page.getByRole("button", { name: "Darsni yakunlash", exact: true }).click();
  await expect(page.getByRole("button", { name: "Dars yakunlangan", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Keyingi dars" }).click();
  await expect(page.getByRole("heading", { name: "Kundalik iboralar", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("#kurs-english")).toContainText("1/3 dars");
});

test("quiz scores answers and remembers personal best", async ({ page }) => {
  await page.goto("/testlar/");
  await page.getByRole("button", { name: "Viktorinani boshlash" }).click();
  await expect(page.getByRole("button", { name: "Keyingi savol" })).toBeDisabled();
  const answers = ["1991-yil 18-noyabr", "Abdulla Qodiriy", "Ikki bosqichli tasdiqlashni yoqish", "Nice to meet you", "Manbasi va dalillariga", "Muhim faktlarni mustaqil manbadan tekshirish", "14-yanvar", "Vazifalarni kelishish va bir-birini tinglash"];
  for (let index = 0; index < answers.length; index++) {
    await page.getByRole("button", { name: new RegExp(answers[index]) }).click();
    await page.getByRole("button", { name: index === answers.length - 1 ? "Natijani ko‘rish" : "Keyingi savol" }).click();
  }
  await expect(page.locator(".learn-score")).toHaveText("8/8");
  await page.getByRole("button", { name: "Javoblarni tahlil qilish" }).click();
  await expect(page.locator(".learn-review article")).toHaveCount(8);
  await page.reload();
  await expect(page.locator(".learn-personal-best>strong")).toHaveText("8 / 8");
});

test("demo profile and subscription work without sending a payment", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Kirish", exact: true }).click();
  await page.getByLabel("Ismingiz", { exact: true }).fill("Aziz");
  await page.getByLabel("Telefon raqamingiz", { exact: true }).fill("901234567");
  await page.getByRole("button", { name: "Demo profil yaratish" }).click();
  await expect(page.getByRole("heading", { name: "Xush kelibsiz, Aziz!" })).toBeVisible();
  await page.goto("/obuna/");
  await page.getByRole("button", { name: "Obunani tanlash", exact: true }).click();
  await expect(page.getByRole("button", { name: "Demo obunani faollashtirish" })).toBeDisabled();
  await page.getByRole("button", { name: "Payme", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Demo obunani faollashtirish" }).click();
  await expect(page.getByText("Yillik demo obunangiz faol", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Yillik demo obunangiz faol", { exact: true })).toBeVisible();
});

test("live channel selection and schedule are interactive", async ({ page }) => {
  await page.goto("/jonli-efir/");
  await page.getByRole("button", { name: /Sport Sport telekanali/ }).click();
  await expect(page.locator(".live-preview-channel")).toContainText("Sport");
  await page.getByRole("button", { name: "Ertaga", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ertaga", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".live-guide-list")).toContainText("Yangi tong");
});

test("invalid browser storage falls back safely and banner metadata follows slides", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("armtv-saved", JSON.stringify({ broken: true }));
    localStorage.setItem("armtv-profile", JSON.stringify("invalid"));
    localStorage.setItem("armtv-progress", JSON.stringify(["bad"]));
  });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Kirish", exact: true })).toBeVisible();
  await expect(page.locator(".hero-meta")).toContainText("8.7");
  await page.getByRole("button", { name: "2-banner: Chegarachi" }).click();
  await expect(page.locator(".hero-meta")).toContainText("9.1");
  await expect(page.locator(".hero-meta")).toContainText("12+");
  expect(errors).toEqual([]);
});

test("every section works on mobile without overflow or runtime errors", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const route of ["/", "/filmlar/", "/tarjima/", "/bolalar/", "/kutubxona/", "/talim/", "/testlar/", "/yangiliklar/", "/saqlanganlar/", "/obuna/", "/jonli-efir/", "/film/chegarachi/"]) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth), route).toBeLessThanOrEqual(390);
    expect(await page.locator("img").evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0).map(image => image.getAttribute("src"))), route).toEqual([]);
  }
  await page.getByRole("button", { name: "Menyuni ochish", exact: true }).click();
  await expect(page.locator(".sidebar")).toHaveClass(/sidebar-open/);
  await page.locator(".sidebar").getByRole("link", { name: "Kutubxona", exact: true }).click();
  await expect(page.locator(".sidebar")).not.toHaveClass(/sidebar-open/);
  expect(errors).toEqual([]);
});
