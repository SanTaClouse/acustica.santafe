"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { TIPOS_DE_ESPACIO } from "@/content/site";
import { buildMessage, buildWaUrl } from "@/lib/whatsapp";
import { buttonClass } from "@/components/ui/button";
import { controlClass, labelClass } from "@/components/ui/field";
import { QtyControl } from "@/components/ui/QtyControl";
import { cart, useCartItems, useCartUi } from "./cart-store";

// <dialog> modal: atrapa el foco, cierra con Escape y deja inerte el resto de la página.
export function CartDrawer() {
  const items = useCartItems();
  const { open, espacio } = useCartUi();
  const [form, setForm] = useState({ nombre: "", ciudad: "", nota: "" });
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const waHref = buildWaUrl(buildMessage(items, { ...form, espacio }));
  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  return (
    <dialog
      ref={ref}
      aria-labelledby="consulta-titulo"
      onClose={cart.close}
      // Un clic fuera del panel cae sobre el propio <dialog> (su ::backdrop).
      onClick={(e) => e.target === e.currentTarget && cart.close()}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(460px,100%)] max-w-none border-0 border-l border-line bg-bg p-0 text-fg backdrop:bg-[rgb(10_11_12/0.4)]"
    >
      <div className="flex h-full flex-col pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-between border-b border-line px-7 py-6">
          <h2
            id="consulta-titulo"
            className="text-h3 leading-tight font-normal tracking-[-0.01em]"
          >
            Mi consulta
          </h2>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={cart.close}
            className="px-2 py-1 text-[28px] leading-none text-fg"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto px-7 pt-2 pb-6">
          {items.length ? (
            <ul>
              {items.map((it) => (
                <li
                  key={it.key}
                  className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 border-b border-line py-4.5"
                >
                  <div className="font-medium">
                    {it.servicio ? it.nombre : `${it.qty} × ${it.nombre}`}
                  </div>
                  <div className="col-start-1 text-sm text-muted">
                    {it.detalle}
                  </div>
                  <div className="col-start-2 row-span-2 row-start-1 flex flex-col items-end gap-2">
                    {!it.servicio && (
                      <QtyControl
                        value={it.qty}
                        onChange={(d) => cart.changeQty(it.key, d)}
                      />
                    )}
                    <button
                      type="button"
                      aria-label={`Quitar ${it.nombre}`}
                      onClick={() => cart.remove(it.key)}
                      className="text-[13px] text-muted underline"
                    >
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-12 text-muted">
              Todavía no agregaste nada. Sumá productos o un servicio, o
              escribinos directamente con tu caso.
            </p>
          )}

          <form
            className="mt-6 grid gap-3.5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label htmlFor="f-nombre" className={labelClass}>
                Nombre
              </label>
              <input
                id="f-nombre"
                autoComplete="name"
                placeholder="Tu nombre"
                className={controlClass}
                {...field("nombre")}
              />
            </div>
            <div>
              <label htmlFor="f-ciudad" className={labelClass}>
                Ciudad
              </label>
              <input
                id="f-ciudad"
                autoComplete="address-level2"
                placeholder="Ej.: Rosario"
                className={controlClass}
                {...field("ciudad")}
              />
            </div>
            <div>
              <label htmlFor="f-espacio" className={labelClass}>
                Tipo de espacio
              </label>
              <select
                id="f-espacio"
                value={espacio}
                onChange={(e) => cart.setEspacio(e.target.value)}
                className={controlClass}
              >
                {TIPOS_DE_ESPACIO.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="f-nota" className={labelClass}>
                Contanos tu caso (opcional)
              </label>
              <textarea
                id="f-nota"
                rows={3}
                placeholder="Medidas del lugar, qué te molesta, plazos…"
                className={controlClass}
                {...field("nota")}
              />
            </div>
          </form>
        </div>

        <div className="border-t border-line px-7 py-5">
          <a
            href={waHref}
            target="_blank"
            rel="noopener"
            className={buttonClass({ className: "w-full justify-center" })}
          >
            Pedir presupuesto por WhatsApp
          </a>
          <small className="mt-2.5 block text-center text-xs text-muted">
            Se abre WhatsApp con tu pedido ya escrito. Revisalo y envialo.
          </small>
        </div>
      </div>
    </dialog>
  );
}
