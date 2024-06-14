import fs from 'fs';
import { z } from "zod";
/* Comprefaces lo basico */
import { CompreFace } from '@exadel/compreface-js-sdk';
const api_key = "ea34982f-d453-4364-b906-30bd06b55475";
const url = "http://localhost";
const port = 8000;
const compreFace = new CompreFace(url, port); // set CompreFace url and port 
const recognitionService = compreFace.initFaceRecognitionService(api_key); // initialize service
const faceCollection = recognitionService.getFaceCollection(); // use face collection to fill it with known faces


import { router, protectedProcedure } from "../trpc";
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
    eliminarFoto: protectedProcedure.input(
        z.object({
            id: z.number(),
        })
    ).mutation(async ({ ctx, input }) => {
        try {
            const foto = await ctx.prisma.fotos.findUnique({
                where: {
                    id: input.id,
                },
            });
            if (!foto) {
                throw new Error("No se encontró la foto");
            }
            /* eliminamos la foto de la carpeta */
            fs.unlinkSync(foto.foto_url);
            /* Eliminamos de la base de datos */
            await ctx.prisma.fotos.delete({
                where: {
                    id: input.id,
                },
            });
            await faceCollection.delete(foto.compreface_id as string);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    }),
});