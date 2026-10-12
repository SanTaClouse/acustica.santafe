export function QtyControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (delta: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Cantidad"
      className="flex items-center rounded-full border border-line"
    >
      <button
        type="button"
        aria-label="Menos"
        onClick={() => onChange(-1)}
        className="h-10.5 w-9.5 text-lg text-fg"
      >
        −
      </button>
      <span
        aria-live="polite"
        className="min-w-6.5 text-center font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Más"
        onClick={() => onChange(1)}
        className="h-10.5 w-9.5 text-lg text-fg"
      >
        +
      </button>
    </div>
  );
}
