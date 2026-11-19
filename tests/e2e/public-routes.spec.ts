import { expect, test } from "@playwright/test";

test.describe("Public portfolio routes", () => {
  test("landing page renders hero, about, CTA, and toggles theme", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Fullstack Developer.");
    await expect(page.getByRole("link", { name: "View My Work" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About Me" })).toBeVisible();

    const html = page.locator("html");
    const hadDark = await html.evaluate((el) => el.classList.contains("dark"));

    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect
      .poll(async () => html.evaluate((el) => el.classList.contains("dark")))
      .toBe(!hadDark);
  });

  test("about page renders seeded profile and experience timeline", async ({ page }) => {
    await page.goto("/about");

    await expect(page.getByRole("heading", { name: "Avin E2E" })).toBeVisible();
    await expect(
      page.getByText("Fullstack Developer & Automation Tester")
    ).toBeVisible();
    await expect(page.getByText("A-1412 Labs")).toBeVisible();
  });

  test("projects page renders seeded projects and supports search", async ({ page }) => {
    await page.goto("/projects");

    await expect(page.getByText("A-1412 Automated Portfolio")).toBeVisible();
    await expect(page.getByText("CLI Starter Kit")).toBeVisible();

    const searchInput = page.getByPlaceholder(/Search by project name/i);
    await searchInput.fill("CLI");
    await searchInput.press("Enter");

    await expect(page).toHaveURL(/\/projects\?q=CLI/);
    await expect(page.getByText("Found 1 project")).toBeVisible();
    await expect(page.getByText("CLI Starter Kit")).toBeVisible();
    await expect(page.getByText("A-1412 Automated Portfolio")).toHaveCount(0);

    await page.getByRole("link", { name: "Clear" }).click();
    await expect(page).toHaveURL(/\/projects$/);
  });

  test("blog list, tag filter, search, and markdown GFM table render properly", async ({
    page,
  }) => {
    await page.goto("/blog");

    await expect(page.getByText("Automated CI & GFM Tables Guide")).toBeVisible();
    await expect(page.getByText("Second Sample Post")).toBeVisible();

    const searchInput = page.getByPlaceholder(/Search/i);
    await searchInput.fill("GFM");
    await searchInput.press("Enter");

    await expect(page).toHaveURL(/\/blog\?.*q=GFM/);
    await expect(page.getByText("Automated CI & GFM Tables Guide")).toBeVisible();

    await page.goto("/blog/automated-ci-gfm-tables");
    await expect(
      page.getByRole("heading", { name: "Automated CI & GFM Tables Guide" })
    ).toBeVisible();

    // Verify remark-gfm renders <table> properly
    const table = page.locator("article table");
    await expect(table).toBeVisible();
    await expect(table.getByRole("columnheader", { name: "Check" })).toBeVisible();
    await expect(table.getByRole("cell", { name: "Playwright E2E" })).toBeVisible();
  });

  test("guestbook displays seeded entry and chat widget answers FAQ", async ({ page }) => {
    await page.goto("/guestbook");
    await expect(page.getByText("Hello from E2E seed data!")).toBeVisible();

    await page.getByRole("button", { name: "Toggle AI assistant chat" }).click();
    await page.getByRole("button", { name: "Who are you?" }).click();

    await expect(
      page.getByText(/I'm Avin, a Fullstack Developer/i)
    ).toBeVisible();
  });

  test("serves SEO endpoints, custom 404, and fits mobile viewport cleanly", async ({
    page,
    request,
  }) => {
    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain("Sitemap:");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    const sitemapBody = await sitemapRes.text();
    expect(sitemapBody).toContain("/projects");
    expect(sitemapBody).toContain("/blog/automated-ci-gfm-tables");

    await page.goto("/non-existent-route-phase9");
    await expect(
      page.getByRole("heading", { name: "Page not found" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Home/i })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["/", "/about", "/projects", "/blog", "/guestbook"]) {
      await page.goto(route);
      const hasOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      );
      expect(hasOverflow, `Horizontal overflow detected on ${route}`).toBe(false);
    }
  });
});
