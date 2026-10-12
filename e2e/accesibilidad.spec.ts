import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const colorScheme of ["light", "dark"] as const) {
  test(`sin violaciones de accesibilidad (tema ${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
    ).toEqual([]);
  });

  test(`panel de consulta accesible (tema ${colorScheme})`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await page
      .getByRole("button", { name: "Consultar por una sala de streaming" })
      .click();
    const dialog = page.getByRole("dialog", { name: "Mi consulta" });
    await expect(dialog).toBeVisible();
    // El foco queda dentro del panel.
    await expect(dialog.locator(":focus")).toHaveCount(1);
    const { violations } = await new AxeBuilder({ page })
      .include("dialog")
      .analyze();
    expect(violations.map((v) => v.id)).toEqual([]);
  });
}
