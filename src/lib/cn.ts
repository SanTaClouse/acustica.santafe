import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge necesita conocer la escala de texto propia del tema para no
// descartar, por ejemplo, `text-small` al combinarla con `text-muted`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "xs",
            "sm",
            "small",
            "body",
            "lg",
            "xl",
            "lead",
            "h3",
            "h2",
            "display",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
