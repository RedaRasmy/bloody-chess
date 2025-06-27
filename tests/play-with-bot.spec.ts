import { test, expect } from "@playwright/test"

test("should navigate to the home page then play some moves with a bot", async ({
    page,
}) => {
    await page.goto('/')
    await page.click("text=Bot")
    await page.click("text=Start")
    await expect(page).toHaveURL("/en/play/bot")

    // play pawn e2 -> e4 by clicking

    const e2 = page.locator("[data-testid='e2']")
    const e4 = page.locator("[data-testid='e4']")

    await e2.click()
    await e4.click()


    // white pawn from e2 should be in e4 now
    await expect(e4.locator("[data-testid='wp']")).toBeVisible()
})
