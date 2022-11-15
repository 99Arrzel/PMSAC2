import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const personasRouter = router({
    listarPersonas: protectedProcedure
        .input(z.object({
            like: z.string().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const personas = await ctx.prisma.personas.findMany({
                where: {
                    OR: [
                        {
                            nombre: {
                                contains: input.like ?? "",
                                mode: "insensitive",
                            },
                        },
                        {
                            apellido_p: {
                                contains: input.like ?? "",
                                mode: "insensitive",
                            },
                        },
                        {
                            apellido_m: {
                                contains: input.like ?? "",
                                mode: "insensitive",
                            }
                        },
                        {
                            carnet: {
                                contains: input.like ?? "",
                                mode: "insensitive",
                            },
                        },
                        {
                            telefono: {
                                contains: input.like ?? "",
                                mode: "insensitive",
                            },
                        },
                        {
                            direccion: {
                                contains: input.like ?? "",
                            }
                        }
                    ],
                },
            });

            return personas;
        }),
    crearPersona: protectedProcedure.input(
        z.object({
            nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
            apellido_p: z.string().min(3, { message: "El apellido paterno debe tener al menos 3 caracteres" }),
            apellido_m: z.string().min(3, { message: "El apellido materno debe tener al menos 3 caracteres" }),
            carnet: z.string().min(7, { message: "El carnet debe tener al menos 7 caracteres" }),
        })
    ).mutation(async ({ ctx, input }) => {
        const persona = await ctx.prisma.personas.create({
            data: {
                nombre: input.nombre,
                apellido_p: input.apellido_p,
                apellido_m: input.apellido_m,
                carnet: input.carnet,
            },
        });
        if (!persona) {
            throw new Error("No se pudo crear la persona");
        }
        return "Persona creada con éxito";
    }),
    editarPersona: protectedProcedure.input(
        z.object({
            id: z.number(),
            nombre: z.string(),
            apellido_p: z.string(),
            apellido_m: z.string(),
            carnet: z.string(),
            telefono: z.string().nullish(),
            direccion: z.string().nullish(),
            fecha_nacimiento: z.date().nullish(),
        })).mutation(async ({ ctx, input }) => {
            const persona = await ctx.prisma.personas.update({
                where: {
                    id: input.id,
                },
                data: {
                    nombre: input.nombre,
                    apellido_p: input.apellido_p,
                    apellido_m: input.apellido_m,
                    carnet: input.carnet,
                    telefono: input.telefono,
                    direccion: input.direccion,
                    fecha_nacimiento: input.fecha_nacimiento,
                },
            });
            if (!persona) {
                throw new Error("No se pudo editar la persona");
            }
            return "Persona editada con éxito";
        }),
    deBajaPersona: protectedProcedure.input(
        z.object({
            id: z.number(),
        })
    ).mutation(async ({ ctx, input }) => {
        const existe = await ctx.prisma.personas.findUnique({
            where: {
                id: input.id,
            },
        });
        const persona = await ctx.prisma.personas.update({
            where: {
                id: input.id,
            },
            data: {
                deleted_at: existe?.deleted_at ? null : new Date(),
            },
        });
        if (!persona) {
            throw new Error("No se pudo dar de baja la persona");
        }
        return "Persona dada de baja con éxito";
    }),
});
