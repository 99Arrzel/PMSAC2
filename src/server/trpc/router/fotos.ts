import { z } from "zod";

import { router, protectedProcedure } from "../trpc";
const MB_BYTES = 1000000;
const ACCEPTED_MIME_TYPES = ["image/gif", "image/jpeg", "image/png"];
export const fotosRouter = router({
    fotosPersona: protectedProcedure.input(
        z.object({
            persona_id: z.number(),
        })
    ).query(
        async ({ ctx, input }) => {
            const fotos = await ctx.prisma.fotos.findMany({
                where: {
                    persona_id: input.persona_id,
                },
            });
            return fotos;
        }
    ),
    /*
    agregarFoto: protectedProcedure
        .input(z.object({
            persona_id: z.number(),
            imagen: z.instanceof(File).superRefine((f, ctx) => {
                // First, add an issue if the mime type is wrong.
                if (!ACCEPTED_MIME_TYPES.includes(f.type)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `El archivo debe ser de tipo [${ACCEPTED_MIME_TYPES.join(
                            ", "
                        )}] pero es ${f.type}`
                    });
                }
                // Next add an issue if the file size is too large.
                if (f.size > 3 * MB_BYTES) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.too_big,
                        type: "array",
                        message: `El archivo no debe ser más grande que ${3 * MB_BYTES} bytes: ${f.size
                            }`,
                        maximum: 3 * MB_BYTES,
                        inclusive: true
                    });
                }
            }),
        }))
        .query(async ({ ctx, input }) => {
            try {

                const nombre = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

                const extension = input.imagen.name.split(".").pop();

                const foto = await ctx.prisma.fotos.create({
                    data: {
                        foto_url: `${nombre}.${extension}`,
                        persona_id: input.persona_id,
                    },
                });
                if (!foto) {
                    throw new Error("No se pudo crear la foto");
                }
                return "Foto creada con éxito";

            } catch (error) {
                throw new Error("No se pudo guardar la imagen");
            }
        }),
    */
    eliminarFoto: protectedProcedure.input(
        z.object({
            id: z.number(),
        })
    ).query(async ({ ctx, input }) => {
        const foto = await ctx.prisma.fotos.delete({
            where: {
                id: input.id,
            },
        });
        if (!foto) {
            throw new Error("No se pudo eliminar la foto");
        }
        return "Foto eliminada con éxito";
    }),
});