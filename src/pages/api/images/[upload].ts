import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
/* Comprefaces lo basico */
import { CompreFace } from "@exadel/compreface-js-sdk";
import { env } from "../../../env/server.mjs";


const url = env.COMPREFACE_URL
const api_key = env.COMPREFACE_API_KEY
const port = 8000;
console.log(url, api_key, port)
const compreFace = new CompreFace(url, port); // set CompreFace url and port
const recognitionService = compreFace.initFaceRecognitionService(api_key); // initialize service
const faceCollection = recognitionService.getFaceCollection(); // use face collection to fill it with known faces
/* ============ */
export const config = {
    api: {
        bodyParser: false,
        
    },
};

const post = async (req: any, res: any) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err: any, fields: any) {
        await saveFile(fields.file, fields.persona_id);
    });
};
const saveFile = async (file: any, id: number) => {
    /* El nuevo path es un UUID generado en el momento */
    try {
        if (!id) {
            throw new Error("No se ha especificado el id de la persona");
        }
        const path = `./public/imagenes/${uuidv4()}.jpg`;
        const data = file.replace(/^data:image\/\w+;base64,/, "");
    /* intentamos guardar la imagen */
        await fs.writeFileSync(path, data, "base64");
        console.log(path);
        console.log("imagen guardada");
        /* Ahora si, si todo bien, guardamos en la db */
        const prisma = new PrismaClient();
        const foto = await prisma.fotos.create({
            data: {
                foto_url: path,
                persona: {
                    connect: {
                      id: Number(id),
                  },
              },
          },
      });
    /* Finalmente guardamos el rostro en comprefaces */
        const compreFaceImage = (await faceCollection.add(path, id.toString())) as {
            image_id: string;
            subject: string;
        };
        await prisma.fotos.update({
            where: {
              id: foto.id,
          },
          data: {
              compreface_id: compreFaceImage.image_id,
          },
      });
    } catch (err) {
        throw new Error("Error al guardar la imagen");
    }
};
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        await post(req, res).then(() => {
            return res.status(201).send("");
        });
    } catch (err) {
        return res.status(500).json({ response: "NOTOK" });
    }
}
