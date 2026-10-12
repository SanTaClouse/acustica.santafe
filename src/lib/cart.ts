// Lógica pura de "Mi consulta". Sin precios: cada ítem es un pedido de presupuesto.

export type CartItem = {
  key: string;
  nombre: string;
  detalle: string;
  qty: number;
  servicio?: true;
};

export type Seleccion = {
  medida: string;
  espesor: string;
  tela: { nombre: string } | null;
};

export function productDetail({ medida, espesor, tela }: Seleccion): string {
  return [medida, espesor, tela ? `Tela ${tela.nombre.toLowerCase()}` : ""]
    .filter(Boolean)
    .join(" · ");
}

export function productItem(
  producto: { id: string; nombre: string },
  sel: Seleccion,
  qty: number,
): CartItem {
  const detalle = productDetail(sel);
  // La misma configuración suma cantidad en lugar de duplicarse.
  return {
    key: `${producto.id}|${detalle}`,
    nombre: producto.nombre,
    detalle,
    qty,
  };
}

export function serviceItem(
  id: string,
  nombre: string,
  detalle = "Servicio",
): CartItem {
  return { key: `svc:${id}`, nombre, detalle, qty: 1, servicio: true };
}

export function addItem(cart: CartItem[], item: CartItem): CartItem[] {
  const existente = cart.find((x) => x.key === item.key);
  if (!existente) return [...cart, item];
  if (item.servicio) return cart;
  return cart.map((x) =>
    x.key === item.key ? { ...x, qty: x.qty + item.qty } : x,
  );
}

export function changeQty(
  cart: CartItem[],
  key: string,
  delta: number,
): CartItem[] {
  return cart.map((x) =>
    x.key === key && !x.servicio
      ? { ...x, qty: Math.max(1, x.qty + delta) }
      : x,
  );
}

export function removeItem(cart: CartItem[], key: string): CartItem[] {
  return cart.filter((x) => x.key !== key);
}

export function countItems(cart: CartItem[]): number {
  return cart.reduce((n, x) => n + (x.servicio ? 1 : x.qty), 0);
}

// Lo guardado en localStorage puede venir de otra versión del sitio o estar
// corrupto: se descarta lo que no tenga la forma esperada.
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.flatMap((x): CartItem[] => {
    if (
      typeof x !== "object" ||
      x === null ||
      typeof x.key !== "string" ||
      typeof x.nombre !== "string" ||
      typeof x.detalle !== "string"
    ) {
      return [];
    }
    if (x.servicio === true)
      return [
        {
          key: x.key,
          nombre: x.nombre,
          detalle: x.detalle,
          qty: 1,
          servicio: true,
        },
      ];
    if (!Number.isInteger(x.qty) || x.qty < 1) return [];
    return [{ key: x.key, nombre: x.nombre, detalle: x.detalle, qty: x.qty }];
  });
}
