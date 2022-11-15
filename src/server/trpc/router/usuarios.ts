import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const usuariosRouter = router({
  listarUsuarios: protectedProcedure
    .input(z.object({
      like: z.string().nullish()
    }))
    .query(({ ctx, input }) => {
      const usuarios = ctx.prisma.user.findMany({
        include: {
          persona: true
        },
        where: {
          OR: [
            {
              usuario: {
                contains: input.like ?? "",
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: input.like ?? "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      return usuarios;
    }),
  crearUsuario: protectedProcedure.input(
    z.object({
      usuario: z.string(),
      password: z.string(),
      persona_id: z.number(),
      rol: z.enum(["ADMIN", "USUARIO", "CAMARA"]),
    })
  ).query(async ({ ctx, input }) => {
    const usuario = await ctx.prisma.user.create({
      data: {
        usuario: input.usuario,
        password: input.password, //Falta hashear
        persona_id: input.persona_id,
        rol: input.rol,
      },
    });
    if (!usuario) {
      throw new Error("No se pudo crear el usuario");
    }
    return "Usuario creado con éxito";
  }),
  deBajaUsuario: protectedProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const usuario = await ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        deleted_at: new Date(),
        persona: {
          update: {
            deleted_at: new Date(),
          }
        }
      },
    });
    if (!usuario) {
      throw new Error("No se pudo eliminar el usuario");
    }
    return "Usuario eliminado con éxito";
  }),
  editarUsuario: protectedProcedure.input(
    z.object({
      id: z.string(),
      usuario: z.string(),
      password: z.string(),
      persona_id: z.number(),
      rol: z.enum(["ADMIN", "USUARIO", "CAMARA"]),
    })
  ).query(async ({ ctx, input }) => {
    const usuario = await ctx.prisma.user.update({
      where: {
        id: input.id,
      },
      data: {
        usuario: input.usuario,
        password: input.password, //Falta hashear
        persona_id: input.persona_id,
        rol: input.rol,
      },
    });
    if (!usuario) {
      throw new Error("No se pudo editar el usuario");
    }
    return "Usuario editado con éxito";
  }),
});
