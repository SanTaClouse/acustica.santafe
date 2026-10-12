import type { ReactNode } from "react";
import { Container } from "./Container";

export function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="pt-(--section)">
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-10 grid items-end gap-x-16 gap-y-8 md:mb-16 md:grid-cols-2 [&>*]:min-w-0">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-4.5">{title}</h2>
      </div>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}
