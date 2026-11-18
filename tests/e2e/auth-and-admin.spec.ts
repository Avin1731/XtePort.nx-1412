import { expect, test, type Page } from "@playwright/test";

const TEST_SECRET = process.env.E2E_AUTH_SECRET || "e2e_local_test_secret";

async function signInAsTestUser(page: Page, email: string) {
  const csrfResponse = await page.request.get("/api/auth/csrf");
  expect(csrfResponse.ok()).toBeTruthy();
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const loginResponse = await page.request.post(
    "/api/auth/callback/e2e-credentials",
    {
      form: {
        csrfToken,
        email,
        secret: TEST_SECRET,
        json: "true",
      },
    }
  );
  expect(loginResponse.ok()).toBeTruthy();
}

test.describe("Auth middleware & protected routes", () => {
  test("unauthenticated request to /dashboard redirects to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/api\/auth\/signin/);
  });

  test("non-admin user cannot access /dashboard and can sign guestbook", async ({
    page,
  }) => {
    await signInAsTestUser(page, "visitor@example.com");

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/guestbook");
    const uniqueMessage = `E2E guestbook message ${Date.now()}`;
    await page
      .getByPlaceholder(/Type your message in #General/i)
      .fill(uniqueMessage);
    await page.locator('form button[type="submit"]').first().click();

    await expect(page.getByText(uniqueMessage)).toBeVisible();
  });

  test("admin user can access all /dashboard routes cleanly", async ({ page }) => {
    await signInAsTestUser(page, process.env.ADMIN_EMAIL || "admin@example.com");

    const adminRoutes = [
      "/dashboard",
      "/dashboard/projects",
      "/dashboard/tech",
      "/dashboard/blog",
      "/dashboard/blog/new",
      "/dashboard/profile",
      "/dashboard/guestbook",
      "/dashboard/messages",
    ];

    for (const route of adminRoutes) {
      const response = await page.goto(route);
      expect(response?.status(), `Route ${route} should return < 400`).toBeLessThan(400);
      await expect(page).toHaveURL(new RegExp(`${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
    }
  });
});
