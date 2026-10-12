import { cn } from "@/lib/cn";

// Botones en píldora. El principal es grafito; "light" va sobre fotos oscuras y la
// banda oscura; "ink" va sobre fotos claras (fijo, no cambia con el tema).
const variantes = {
  primary: "border-fg bg-fg text-bg",
  ghost: "border-fg bg-transparent text-fg",
  light: "border-white bg-white text-[#1d1f21]",
  "light-ghost": "border-white bg-transparent text-white",
  ink: "border-[#1d1f21] bg-[#1d1f21] text-white",
  "ink-ghost": "border-[#1d1f21] bg-transparent text-[#1d1f21]",
} as const;

export type ButtonVariant = keyof typeof variantes;

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: "md" | "sm"; className?: string } = {}) {
  return cn(
    size === "sm" ? "px-4.5 py-2.75 text-sm" : "px-6.5 py-4 text-small",
    // leading después del tamaño: tailwind-merge descarta el leading anterior a un text-*.
    "inline-flex items-center gap-2.5 rounded-full border leading-none font-medium",
    "transition-[transform,opacity] duration-150 hover:opacity-88 active:scale-98",
    variantes[variant],
    className,
  );
}
