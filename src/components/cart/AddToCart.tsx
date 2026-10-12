"use client";

import { serviceItem } from "@/lib/cart";
import { buttonClass } from "@/components/ui/button";
import { cart } from "./cart-store";

export function AddServiceButton({
  id,
  nombre,
}: {
  id: string;
  nombre: string;
}) {
  return (
    <button
      type="button"
      onClick={() => cart.add(serviceItem(id, nombre))}
      className={buttonClass()}
    >
      Agregar a mi consulta
    </button>
  );
}

// Banda de productoras: suma el proyecto, fija el tipo de espacio y abre el panel.
export function StreamingCta() {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => {
        cart.setEspacio("Sala de streaming");
        cart.add(
          serviceItem(
            "streaming",
            "Proyecto sala de streaming",
            "Consulta para productora",
          ),
        );
        cart.open();
      }}
      className={buttonClass({ variant: "light" })}
    >
      Consultar por una sala de streaming
    </button>
  );
}
