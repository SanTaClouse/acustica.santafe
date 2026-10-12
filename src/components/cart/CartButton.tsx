"use client";

import { countItems } from "@/lib/cart";
import { buttonClass } from "@/components/ui/button";
import { cart, useCartItems } from "./cart-store";

export function CartButton() {
  const n = countItems(useCartItems());
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={cart.open}
      className={buttonClass({ variant: "ghost", size: "sm" })}
    >
      Mi consulta
      <span className="inline-grid h-5.5 min-w-5.5 place-items-center rounded-full bg-accent px-1.5 text-xs text-on-accent tabular-nums">
        {n}
      </span>
    </button>
  );
}

// Solo en mobile, junto al botón de WhatsApp (en desktop está en la nav).
export function CartFab() {
  const n = countItems(useCartItems());
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={cart.open}
      className={buttonClass({
        className: "shadow-[0_10px_30px_rgb(0_0_0/0.18)] md:hidden",
      })}
    >
      Mi consulta · <span className="tabular-nums">{n}</span>
    </button>
  );
}
