import { expect, test, type Page } from "@playwright/test";

const consulta = (page: Page) =>
  page.getByRole("dialog", { name: "Mi consulta" });
const abrirConsulta = (page: Page, isMobile: boolean) =>
  isMobile
    ? page.getByRole("button", { name: /Mi consulta ·/ }).click()
    : page
        .getByRole("banner")
        .getByRole("button", { name: /Mi consulta/ })
        .click();

async function waText(page: Page) {
  const href = await consulta(page)
    .getByRole("link", { name: "Pedir presupuesto por WhatsApp" })
    .getAttribute("href");
  const url = new URL(href!);
  expect(url.origin + url.pathname).toBe("https://wa.me/5493424639480");
  return url.searchParams.get("text")!;
}

test("arma una consulta de producto y la envía a WhatsApp con el formato acordado", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Panel absorbente" }) });
  await card.getByLabel("Espesor").selectOption("100 mm");
  await card.getByRole("button", { name: "Azul" }).click();
  await expect(card.getByText("Tela · Azul")).toBeVisible();
  await card.getByRole("button", { name: "Más" }).click();
  await card.getByRole("button", { name: "Agregar Panel absorbente" }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Panel absorbente agregado a tu consulta",
  );

  await abrirConsulta(page, isMobile);
  const dialog = consulta(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("2 × Panel absorbente")).toBeVisible();
  await dialog.getByLabel("Nombre").fill("Ana");
  await dialog.getByLabel("Ciudad").fill("Rosario");
  await dialog
    .getByLabel("Tipo de espacio")
    .selectOption("Estudio de grabación");

  expect(await waText(page)).toBe(
    [
      "Hola, Acústica Santa Fe. Quiero pedir un presupuesto.",
      "Nombre: Ana",
      "Ciudad: Rosario",
      "Tipo de espacio: Estudio de grabación",
      "",
      "Mi consulta:",
      "• 2 × Panel absorbente (120 × 60 cm · 100 mm · Tela azul)",
      "",
      "Enviado desde acusticasantafe.com",
    ].join("\n"),
  );

  // Escape cierra el panel y la consulta sobrevive a una recarga.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await page.reload();
  await abrirConsulta(page, isMobile);
  await expect(consulta(page).getByText("2 × Panel absorbente")).toBeVisible();
});

test("la banda de productoras suma el proyecto, fija el tipo de espacio y abre el panel", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Consultar por una sala de streaming" })
    .click();
  const dialog = consulta(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Proyecto sala de streaming")).toBeVisible();
  await expect(dialog.getByLabel("Tipo de espacio")).toHaveValue(
    "Sala de streaming",
  );
  expect(await waText(page)).toContain("• Proyecto sala de streaming");
});

test("los servicios no se duplican y se pueden quitar", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const servicio = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: "Asesoramiento acústico" }),
  });
  await servicio.getByRole("button", { name: "Agregar a mi consulta" }).click();
  await servicio.getByRole("button", { name: "Agregar a mi consulta" }).click();
  await abrirConsulta(page, isMobile);
  const dialog = consulta(page);
  await expect(dialog.getByRole("listitem")).toHaveCount(1);
  await dialog
    .getByRole("button", { name: "Quitar Asesoramiento acústico" })
    .click();
  await expect(dialog.getByText("Todavía no agregaste nada.")).toBeVisible();
});

test("filtrar oculta tarjetas sin perder lo elegido", async ({ page }) => {
  await page.goto("/");
  const card = page
    .getByRole("article")
    .filter({ has: page.getByRole("heading", { name: "Panel absorbente" }) });
  await card.getByLabel("Medida").selectOption("60 × 60 cm");
  await page.getByRole("button", { name: "Graves", exact: true }).click();
  await expect(card).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "Trampa de graves de esquina" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await expect(card.getByLabel("Medida")).toHaveValue("60 × 60 cm");
});

test("botón flotante de WhatsApp con el mensaje predefinido", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const wa = page.getByRole("link", { name: "Escribinos por WhatsApp" });
  await expect(wa).toBeVisible();
  await expect(wa).toHaveAttribute(
    "href",
    "https://wa.me/5493424639480?text=Hola%2C%20vengo%20de%20la%20web.",
  );
  await expect(wa).toHaveAttribute("target", "_blank");

  const fab = page.getByRole("button", { name: /Mi consulta ·/ });
  if (isMobile) {
    // En mobile conviven en una fila sin superponerse ni salirse de la pantalla.
    await expect(fab).toBeVisible();
    const a = (await fab.boundingBox())!;
    const b = (await wa.boundingBox())!;
    expect(a.x + a.width).toBeLessThanOrEqual(b.x);
    expect(a.x).toBeGreaterThanOrEqual(0);
    expect(b.x + b.width).toBeLessThanOrEqual(360);
  } else {
    await expect(fab).toBeHidden();
  }
});

test("la nav lleva a Quiénes somos", async ({ page, isMobile }) => {
  test.skip(isMobile, "en mobile la nav no muestra enlaces");
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Secciones" })
    .getByRole("link", { name: "Nosotros" })
    .click();
  await expect(page).toHaveURL(/#nosotros$/);
  await expect(
    page.getByRole("heading", { name: "Acústica a medida para cada espacio." }),
  ).toBeInViewport();
});
