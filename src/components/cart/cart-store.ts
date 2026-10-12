"use client";

import { useSyncExternalStore } from "react";
import {
  addItem,
  changeQty,
  parseStoredCart,
  removeItem,
  type CartItem,
} from "@/lib/cart";
import { TIPOS_DE_ESPACIO } from "@/content/site";

// Un store mínimo compartido por las islas de cliente (nav, tarjetas, panel,
// botones flotantes). Los ítems persisten en localStorage con la misma clave y
// formato que el prototipo; el resto es estado de interfaz.

const STORAGE_KEY = "asf-cart";

type Ui = {
  open: boolean;
  espacio: string;
  toast: { id: number; text: string } | null;
};

const SIN_ITEMS: CartItem[] = [];
const UI_INICIAL: Ui = {
  open: false,
  espacio: TIPOS_DE_ESPACIO[0],
  toast: null,
};

let items: CartItem[] | null = null;
let ui = UI_INICIAL;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function leerItems(): CartItem[] {
  try {
    return parseStoredCart(localStorage.getItem(STORAGE_KEY));
  } catch {
    return SIN_ITEMS; // almacenamiento bloqueado (modo privado, permisos)
  }
}

function onStorage(e: StorageEvent) {
  if (e.key !== STORAGE_KEY) return;
  items = leerItems(); // otra pestaña cambió la consulta
  emit();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

function getItems() {
  items ??= leerItems();
  return items;
}

function setItems(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  emit();
}

function setUi(patch: Partial<Ui>) {
  ui = { ...ui, ...patch };
  emit();
}

// En el servidor (y durante la hidratación) la consulta está vacía; después
// React vuelve a renderizar con lo guardado, sin errores de hidratación.
export function useCartItems() {
  return useSyncExternalStore(subscribe, getItems, () => SIN_ITEMS);
}

export function useCartUi() {
  return useSyncExternalStore(
    subscribe,
    () => ui,
    () => UI_INICIAL,
  );
}

let toastId = 0;
export function showToast(text: string) {
  const id = ++toastId;
  setUi({ toast: { id, text } });
  setTimeout(() => {
    if (ui.toast?.id === id) setUi({ toast: null });
  }, 2200);
}

export const cart = {
  add(item: CartItem) {
    setItems(addItem(getItems(), item));
    showToast(`${item.nombre} agregado a tu consulta`);
  },
  changeQty(key: string, delta: number) {
    setItems(changeQty(getItems(), key, delta));
  },
  remove(key: string) {
    setItems(removeItem(getItems(), key));
  },
  open() {
    setUi({ open: true });
  },
  close() {
    setUi({ open: false });
  },
  setEspacio(espacio: string) {
    setUi({ espacio });
  },
};
