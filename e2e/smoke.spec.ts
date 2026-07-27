import { expect, test } from "@playwright/test";

test("home page loads with hero content and nav", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle(/Anesis/);
	await expect(page.getByText("Anesis CLI Registry")).toBeVisible();
	await expect(page.getByText("npm install -g anesis-cli")).toBeVisible();
	await expect(
		page.getByRole("navigation").getByRole("link", { name: "Docs" }),
	).toBeVisible();
});

test("nav Docs link navigates to the docs page", async ({ page }) => {
	await page.goto("/");

	await page.getByRole("navigation").getByRole("link", { name: "Docs" }).click();

	await expect(page).toHaveURL(/\/docs$/);
	await expect(page).toHaveTitle(/Anesis/);
});

test("docs page renders section navigation", async ({ page }) => {
	await page.goto("/docs");

	await expect(
		page.getByRole("link", { name: /Installation/i }).first(),
	).toBeVisible();
});
