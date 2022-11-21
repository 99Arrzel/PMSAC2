import { Prisma } from "@prisma/client";
import { z } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { router, protectedProcedure } from "../trpc";
import fs from "fs";
/* Comprefaces lo basico */
import { CompreFace, Options } from '@exadel/compreface-js-sdk';
import { env } from "process";
const api_key = "ea34982f-d453-4364-b906-30bd06b55475";
const url = "http://localhost";
const port = 8000;
const compreFace = new CompreFace(url, port); // set CompreFace url and port 
const recognitionService = compreFace.initFaceRecognitionService(api_key); // initialize service
const options: Options = {
    limit: 1,
    det_prob_threshold: 0.5,
    prediction_count: 1,
    //status: true
}
type recognitionResponse = {
    subject: string;
    similarity: number;
};
type recognitionBox = {
    x: number;
    y: number;
    width: number;
    height: number;
}
type recognitionResult = {
    box: recognitionBox;
    subjects: recognitionResponse[];
}

type responseApiRecognition = {
    /* Result array */
    result: recognitionResult[];

}


export const registrosRouter = router({
    nuevoRegistro: protectedProcedure.input(
        z.object({
            foto: z.string(), // base64
            camara_id: z.number(), //Esto no debería hacerse, sabes, deberiamos inferirlo desde ctx, pero ok
        })
    ).mutation(async ({ input, ctx }) => {
        const path = `./public/asistencia/${uuidv4()}.jpg`;
        try {
            /* Guardamos la imagen */
            const data = input.foto.replace(/^data:image\/\w+;base64,/, "");

            fs.writeFileSync(path, data, 'base64');
            /* Ahora lo comprobamos en compreface */
            /* const b64toBlob = (base64: string) =>
                fetch(`${base64}`).then(res => res.blob())
            const blob = await b64toBlob(input.foto);
            const text = await blob.text(); */
            const url = env.NEXTAUTH_URL + path.replace("./public", "");
            const reconocer = await recognitionService.recognize(path, options).catch((err) => {
                console.log(err);
                return { message: "No se pudo crear el registro", exito: false };
            }) as responseApiRecognition;
            const respuesta = reconocer.result[0]?.subjects[0] ?? null;

            if (respuesta?.subject && respuesta.similarity > 0.8) {
                /* Si existe el subject, entonces creamos el registro */
                console.log("xd")
                const nuevoRegistro = await ctx.prisma.registros.create({
                    data: {
                        fecha: new Date(new Date().getTime() - 4 * 60 * 60 * 1000), //Gmt -4
                        persona_id: Number(respuesta.subject),
                        camara_id: input.camara_id.toString(),
                        foto_url: path,
                    }
                });

                if (!nuevoRegistro) {
                    throw new Error("No se pudo crear el registro");
                }
                /* Query de la persona  */
                const persona = await ctx.prisma.personas.findUnique({
                    where: {
                        id: Number(respuesta.subject)
                    },
                });
                return { message: "Registro creado con éxito", exito: true, persona, similaridad: respuesta.similarity };
            }
            /* si no hay respuesta, borrramos la foto */
            fs.unlink(path, (err) => {
                if (err) {
                    throw new Error("No se pudo eliminar la foto: " + err);
                }
            });
            /* y retornamos no encontrado */
            return { message: "Rostro desconocido", exito: false };
        } catch (error) {
            console.log(error);
            /* eliminamos la foto */
            fs.unlink(path, (err) => {
                if (err) {
                    throw new Error("No se pudo eliminar la foto: " + err);

                }
            });
            return { message: "No se pudo crear el registro", exito: false };


        }
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