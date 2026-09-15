import { defineConfig } from "@playwright/test";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/+$/, "");
const localURL = `http://127.0.0.1:3100${basePath}/`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 40_000,
  expect: { timeout: 8_000 },
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL
      ? `${process.env.PLAYWRIGHT_BASE_URL.replace(/\/+$/, "")}/`
      : localURL,
    channel: "chrome",
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "npm run build && npm run start",
    env: { PORT: "3100", NEXT_PUBLIC_BASE_PATH: basePath },
    url: localURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
