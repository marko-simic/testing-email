// @ts-check
const { test, expect } = require("@playwright/test")

test.describe("Email", () => {
  test("should open MailPit web UI", async ({ page }) => {
    await page.goto("http://localhost:8025")

    await page.pause()
  })
})
// host.docker.internal
