import "server-only";
import { z } from "zod";
import data from "./products.json";
import { TELA_POR_DEFECTO } from "./site";

// El catálogo se valida al importarse: si products.json tiene un error,
// falla el build (y el preview) en lugar de romper la página en producción.

const id = z
  .string()
  .regex(/^[a-z0-9-]+$/, "solo minúsculas, números y guiones");
const texto = z.string().trim().min(1);

const telaSchema = z.object({
  id,
  nombre: texto,
  hex: z.string().regex(/^#[0-9a-f]{6}$/i, "color en formato #RRGGBB"),
});

const productoSchema = z.object({
  id,
  nombre: texto,
  categoria: id,
  forma: z.enum([
    "rect",
    "nube",
    "baffle",
    "trampa",
    "hex",
    "tri",
    "difusor",
    "listones",
    "movil",
  ]),
  resumen: texto,
  detalle: texto,
  medidas: z.array(texto).min(1),
  espesores: z.array(texto),
  tela: z.boolean(),
  fabricado: z.boolean(),
  imagen: z.union([texto, z.record(id, texto)]).optional(),
});

const precio = z.number().int().nonnegative();

// Tarifas del cotizador «Diseñá tu panel» (copia de la pestaña del Sheet).
const cotizadorSchema = z
  .object({
    _nota: z.string().optional(),
    espesores: z.array(z.object({ nombre: texto, precioM2: precio })).min(1),
    formas: z
      .array(
        z.object({
          id: z.enum(["rect", "hex", "tri"]),
          nombre: texto,
          recargo: precio,
        }),
      )
      .min(1),
    kitTecho: precio.nullable(),
    recargoTelaPedido: z.number().min(0).max(1),
    medidaMin: z.number().int().positive(),
    medidaMax: z.number().int().positive(),
  })
  .refine((c) => c.medidaMin < c.medidaMax, {
    message: "cotizador: la medida mínima debe ser menor que la máxima",
  });

const servicioSchema = z.object({
  id,
  nombre: texto,
  etiqueta: texto,
  resumen: texto,
  incluye: z.array(texto).min(1),
  destacado: z.boolean().optional(),
});

const catalogSchema = z
  .object({
    _nota: z.string().optional(),
    telas: z.array(telaSchema).min(1),
    categorias: z.array(z.object({ id, nombre: texto })).min(1),
    productos: z.array(productoSchema).min(1),
    cotizador: cotizadorSchema,
    servicios: z.array(servicioSchema),
  })
  .superRefine((c, ctx) => {
    const unicos = (lista: { id: string }[], nombre: string) => {
      const vistos = new Set<string>();
      for (const { id } of lista) {
        if (vistos.has(id))
          ctx.addIssue({
            code: "custom",
            message: `${nombre}: id repetido "${id}"`,
          });
        vistos.add(id);
      }
    };
    unicos(c.telas, "telas");
    unicos(c.categorias, "categorias");
    unicos(c.productos, "productos");
    unicos(c.servicios, "servicios");

    const categorias = new Set(c.categorias.map((x) => x.id));
    const telas = new Set(c.telas.map((x) => x.id));
    for (const p of c.productos) {
      if (!categorias.has(p.categoria)) {
        ctx.addIssue({
          code: "custom",
          message: `producto "${p.id}": la categoría "${p.categoria}" no existe`,
        });
      }
      if (p.tela && !telas.has(TELA_POR_DEFECTO)) {
        ctx.addIssue({
          code: "custom",
          message: `falta la tela por defecto "${TELA_POR_DEFECTO}"`,
        });
      }
      if (p.imagen && typeof p.imagen === "object") {
        for (const tela of Object.keys(p.imagen)) {
          if (!telas.has(tela)) {
            ctx.addIssue({
              code: "custom",
              message: `producto "${p.id}": imagen para una tela inexistente "${tela}"`,
            });
          }
        }
      }
    }
  });

export type Catalog = z.infer<typeof catalogSchema>;
export type Tela = Catalog["telas"][number];
export type Categoria = Catalog["categorias"][number];
export type Producto = Catalog["productos"][number];
export type Servicio = Catalog["servicios"][number];
export type Cotizador = Catalog["cotizador"];

const resultado = catalogSchema.safeParse(data);
if (!resultado.success) {
  throw new Error(
    `products.json no es válido:\n${z.prettifyError(resultado.error)}`,
  );
}

const catalog = resultado.data;

export function getCatalog(): Catalog {
  return catalog;
}
