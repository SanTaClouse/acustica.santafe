import { describe, expect, it } from "vitest";
import {
  addItem,
  changeQty,
  countItems,
  parseStoredCart,
  productDetail,
  productItem,
  removeItem,
  serviceItem,
  type CartItem,
} from "./cart";

const panel = { id: "panel-absorbente", nombre: "Panel absorbente" };
const grafito = { nombre: "Grafito" };

describe("productDetail", () => {
  it("une medida, espesor y tela en minúsculas", () => {
    expect(
      productDetail({
        medida: "120 × 60 cm",
        espesor: "100 mm",
        tela: grafito,
      }),
    ).toBe("120 × 60 cm · 100 mm · Tela grafito");
  });

  it("omite lo que el producto no tiene (difusor: sin espesor ni tela)", () => {
    expect(
      productDetail({ medida: "60 × 60 cm", espesor: "", tela: null }),
    ).toBe("60 × 60 cm");
  });
});

describe("addItem", () => {
  it("suma cantidad cuando se repite la misma configuración", () => {
    const sel = { medida: "120 × 60 cm", espesor: "100 mm", tela: grafito };
    const cart = addItem(
      addItem([], productItem(panel, sel, 2)),
      productItem(panel, sel, 3),
    );
    expect(cart).toHaveLength(1);
    expect(cart[0].qty).toBe(5);
  });

  it("separa configuraciones distintas del mismo producto", () => {
    const a = productItem(
      panel,
      { medida: "120 × 60 cm", espesor: "50 mm", tela: grafito },
      1,
    );
    const b = productItem(
      panel,
      { medida: "120 × 60 cm", espesor: "100 mm", tela: grafito },
      1,
    );
    expect(addItem(addItem([], a), b)).toHaveLength(2);
  });

  it("no duplica servicios", () => {
    const svc = serviceItem("asesoramiento", "Asesoramiento acústico");
    const cart = addItem(addItem([], svc), svc);
    expect(cart).toEqual([
      {
        key: "svc:asesoramiento",
        nombre: "Asesoramiento acústico",
        detalle: "Servicio",
        qty: 1,
        servicio: true,
      },
    ]);
  });
});

describe("changeQty / removeItem / countItems", () => {
  const cart: CartItem[] = [
    { key: "a", nombre: "A", detalle: "x", qty: 2 },
    serviceItem("asesoramiento", "Asesoramiento acústico"),
  ];

  it("no baja de 1", () => {
    expect(changeQty(cart, "a", -5)[0].qty).toBe(1);
  });

  it("cuenta cantidades de productos y 1 por servicio", () => {
    expect(countItems(cart)).toBe(3);
  });

  it("quita por key", () => {
    expect(removeItem(cart, "a").map((x) => x.key)).toEqual([
      "svc:asesoramiento",
    ]);
  });
});

describe("parseStoredCart", () => {
  it("devuelve [] con datos corruptos", () => {
    expect(parseStoredCart(null)).toEqual([]);
    expect(parseStoredCart("{no es json")).toEqual([]);
    expect(parseStoredCart('{"a":1}')).toEqual([]);
  });

  it("descarta ítems mal formados y conserva los válidos", () => {
    const raw = JSON.stringify([
      { key: "a", nombre: "A", detalle: "x", qty: 2 },
      { key: "b", nombre: "B", detalle: "x", qty: 0 },
      { key: "c", nombre: 3, detalle: "x", qty: 1 },
      {
        key: "svc:s",
        nombre: "S",
        detalle: "Servicio",
        qty: 1,
        servicio: true,
      },
    ]);
    expect(parseStoredCart(raw).map((x) => x.key)).toEqual(["a", "svc:s"]);
  });
});
