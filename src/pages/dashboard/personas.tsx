import { useEffect, useState } from "react";
import AgregarFotosPersona from "../../componentes/AgregarFotosPersona";
import CrearPersona from "../../componentes/CrearPersona";
import DarDeBajaPersona from "../../componentes/DarDeBajaPersona";
import EditarPersona from "../../componentes/EditarPersona";
import { esquemaPersonasType, TablaPersonas } from "../../componentes/Tabla";
import Topbar from "../../componentes/Topbar";
import { trpc } from "../../utils/trpc";
import { InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";

export async function getServerSideProps(context: any) {
    /* Sessión de nextauth con jwt */
    const session = await getToken({ req: context.req, secret: process.env.NEXTAUTH_SECRET });
    console.log(session, "token");
    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }
    return {
        props: {
        },
    };
}


const Personas = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [buscar, setBuscar] = useState<string>("");
    const personas = trpc.personas.listarPersonas.useQuery({ like: buscar });
    const [esquemaData, setEsquemaData] = useState<esquemaPersonasType>([]);
    useEffect(() => {
        /* Nombre, apellido paterno, apellido materno, carnet, fecha de nacimiento, telefono y direccion */

        setEsquemaData(personas.data?.map((persona) => {
            return {
                id: persona.id,
                nombre: persona.nombre,
                apellido_p: persona.apellido_p,
                apellido_m: persona.apellido_m,
                carnet: persona.carnet,
                fecha_nacimiento: persona.fecha_nacimiento,
                telefono: persona.telefono,
                direccion: persona.direccion,
                deleted_at: persona.deleted_at,
            }
        }) ?? []);
    }, [personas.data]);



    return (
        <>
            <Topbar />

            <div className="flex flex-col px-4 mt-2">
                <div className="flex gap-4 text-gray-600">
                    <CrearPersona />
                    <EditarPersona />
                    <DarDeBajaPersona />
                    <AgregarFotosPersona />
                    <input className="border" placeholder="Buscar persona..."
                        onChange={(e) => {
                            setBuscar(e.target.value);
                        }}>
                    </input>
                </div>
                <TablaPersonas datos={esquemaData} />
            </div>
        </>
    )
}
export default Personas;