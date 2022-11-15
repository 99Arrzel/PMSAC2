import { Prisma } from "@prisma/client";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const registrosRouter = router({
    nuevoRegistro: protectedProcedure.input(
        z.object({
            persona_id: z.number(),
            foto_url: z.string()
        })
    ).query(({ input, ctx }) => {
        const nuevo = ctx.prisma.registros.create({
            data: {
                fecha: new Date(),
                persona_id: input.persona_id,
                camara_id: "1",
                foto_url: input.foto_url
            }
        });
        if (!nuevo) {
            throw new Error("No se pudo crear el registro");
        }
        return "Registro creado con éxito";
    }),
    eliminarRegistro: protectedProcedure.input(
        z.object({
            id: z.number(),
        })
    ).query(async ({ ctx, input }) => {
        const registro = await ctx.prisma.registros.delete({
            where: {
                id: input.id,
            },
        });
        if (!registro) {
            throw new Error("No se pudo eliminar el registro");
        }
        return "Registro eliminado con éxito";
    }),
    /* Estos si van a ser un montón, no puedo no ponerle cursores */
    listarRegistros: protectedProcedure.input(
        z.object({
            cursor: z.string().nullish(),
            search: z.string().nullish(),
            take: z.number().min(1).max(50).nullish(),
            antes: z.date().nullish(),
            despues: z.date().nullish(),
        })
    ).query(async ({ ctx, input }) => {
        const take = input.take ?? 10;
        let { cursor } = input;
        const { search } = input;
        input.search ? (cursor = null) : null; // Si hay búsqueda, no hay cursor
        const where: Prisma.RegistrosWhereInput = {
            AND: [
                {
                    fecha: {
                        gte: input.antes ?? new Date(0), // Si no hay fecha, se pone el 1/1/1970, o sea, el inicio de los tiempos (Desde siempre pues)
                    }
                },
                {
                    fecha: {
                        lte: input.despues ?? new Date(), // Si no hay fecha, se pone la fecha actual
                    }
                }
            ],
            OR: [
                {
                    persona: {
                        nombre: {
                            contains: search ?? "",
                            mode: "insensitive",
                        },
                    },
                },
                {
                    persona: {
                        apellido_p: {
                            contains: search ?? "",
                            mode: "insensitive",
                        },
                    },
                },
                {
                    persona: {
                        apellido_m: {
                            contains: search ?? "",
                            mode: "insensitive",
                        },
                    },
                },
                {
                    persona: {
                        carnet: {
                            contains: search ?? "",
                            mode: "insensitive",
                        },
                    },
                }
            ]
        };
        const registros = await ctx.prisma.registros.findMany({
            cursor: cursor ? { id: parseInt(cursor) } : undefined,
            take: take + 1, //Siempre 1 más para el next cursor
            include: {
                persona: true
            },
            where: where, //where,
            orderBy: {
                id: "desc"
            }
        });
        let nextCursor: number | undefined = undefined; //Default
        if (registros.length > take) {
            const nextItem = registros.pop(); //Saca el último elemento
            nextCursor = nextItem?.id ? nextItem.id : undefined; //Seteamos el cursor
        }
        return {
            registros,
            nextCursor,
        };
    }),
});