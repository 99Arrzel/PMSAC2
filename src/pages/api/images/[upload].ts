import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from "formidable";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

export const config = {
    api: {
        bodyParser: false
    }
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
        if (!id) throw new Error("No se ha especificado el id de la persona");
        const path = `./public/imagenes/${uuidv4()}.jpg`;
        const data = file.replace(/^data:image\/\w+;base64,/, "");
        /* intentamos guardar la imagen */
        await fs.writeFileSync(path, data, 'base64');
        console.log(path);
        console.log("imagen guardada");
        /* Ahora si, si todo bien, guardamos en la db */
        const prisma = new PrismaClient();
        const newImage = await prisma.fotos.create({
            data: {
                foto_url: path,
                persona_id: id
            }
        });

    }
    catch (err) {
        console.log(err);
    }
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log("intentando...")
        await post(req, res);
        return res.status(201).send("");
    } catch (err) {
        return res.status(500).json({ response: 'NOTOK' })
    }
}
