/* Upload images to local file storage */
import fs from 'fs';
import { prisma } from '../../../server/db/client';

const upload = async (req: any, res: any) => {
    /* Check if file exists */
    const file = req.body.file;
    /* Generate name for file */
    const name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    /* Get file extension */
    /* Save file to local storage */
    await fs.writeFile(`./public/123.jpg`, file.data, (err) => {
        if (err) {
            throw new Error("No se pudo guardar la imagen");
        }
    });
    /* Save data to prisma */
    const foto = await prisma.fotos.create({
        data: {
            foto_url: `123.jpg`,
            persona_id: req.body.persona_id,
        },
    });
    if (!foto) {
        throw new Error("No se pudo crear la foto");
    }
    return "Foto creada con éxito";

}
export default upload;