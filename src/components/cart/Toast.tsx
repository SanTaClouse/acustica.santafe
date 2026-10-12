"use client";

import { useCartUi } from "./cart-store";

export function Toast() {
  const { toast } = useCartUi();
  return (
    // En mobile sube por encima de los botones flotantes.
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(88px+env(safe-area-inset-bottom,0px))] z-50 flex justify-center px-4 md:bottom-[calc(28px+env(safe-area-inset-bottom,0px))]"
    >
      {toast && (
        <p
          key={toast.id}
          className="rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg"
        >
          {toast.text}
        </p>
      )}
    </div>
  );
}
