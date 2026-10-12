import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-site px-(--gutter)", className)}
      {...props}
    />
  );
}
