import { expect, test as setup } from "@playwright/test"

setup("Presta shop do login", async ({ page }) => {
  await page.goto("http://localhost:8080/adminTest")

  // Login into Prestashop back office
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("admin@testshop.com")
  await page.getByRole("textbox", { name: "Password" }).fill("test_shop")
  await page.getByRole("button", { name: "Log in" }).click()
  await expect(
    await page.getByRole("heading", { name: "Dashboard" })
  ).toBeVisible()

  // Open setup E-mail page
  await page.getByRole("link", { name: "settings_applications" }).click()
  await page.getByRole("link", { name: "E-mail" }).click()
  await expect(page.getByRole("heading", { name: "E-mail" })).toBeVisible()

  // Configure Prestashop E-mail gateway
  await page.getByText("Set my own SMTP parameters (").click()
  await page
    .getByLabel("form_smtp_config_server input")
    .fill("host.docker.internal")
  await page.getByLabel("form_smtp_config_port input").fill("1025")
  await page.getByRole("button", { name: "Save" }).click()
  expect(
    page.getByText("The settings have been successfully updated.")
  ).toBeVisible()

  // Verify email configuration
  await page.getByRole("button", { name: "email Send a test email" }).click()
  await expect(
    page.locator('form[name="test_email_sending"]').getByRole("alert")
  ).toHaveText("A test email has been sent to the email address you provided.")

  await page.pause()
})
