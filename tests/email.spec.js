// @ts-check
const { test, expect } = require("@playwright/test")
const user = require("../test-data/user.json")

test.describe("Email", () => {
  test("The user should receive a welcome email after registration", async ({
    page,
  }) => {
    // Generate unique string
    const uniqueId = new Date().getTime().toString(36)

    // Open the registration form
    await page.goto("http://localhost:8080/registration")
    await expect(
      page.getByRole("heading", { name: "Create an account" })
    ).toBeVisible()

    // Fill out the registration form
    await page.getByText("Mr.").click()
    await page.getByLabel("First name").fill(user.firstName)
    await page.getByLabel("Last name").fill(user.lastName)
    await page.getByLabel("Email").fill(uniqueId + user.email)
    await page.getByLabel("Password input").fill(user.password)
    await page.getByPlaceholder("MM/DD/YYYY").fill(user.birthdate)
    await page.getByText("Receive offers from our").click()
    await page.getByText("I agree to the terms and").click()
    await page.getByText("Sign up for our").click()
    await page.getByText("Customer data privacyThe").click()
    await page.getByRole("button", { name: "Save" }).click()

    await expect(
      page.getByRole("link", { name: `${user.firstName} ${user.lastName}` })
    ).toBeVisible()

    // Open Mailpit web UI
    await page.goto("http://localhost:8025")
    await expect(page).toHaveTitle(/Mailpit/)

    // Search for email
    await page
      .getByPlaceholder("Search mailbox")
      .pressSequentially(uniqueId + user.email)
    await page.getByPlaceholder("Search mailbox").press("Enter")
    await expect(
      page.locator("#message-page >> a", { hasText: "ago" })
    ).toHaveCount(1)

    // Open the email
    await page.locator("#message-page >> a", { hasText: "ago" }).first().click()
    await expect(
      page
        .frameLocator("#preview-html")
        .getByText(`Hi ${user.firstName} ${user.lastName},`)
    ).toBeVisible()

    // Wait for email to be captured in video
    await page.waitForTimeout(1500)
  })
})
