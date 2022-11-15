import Topbar from "../../componentes/Topbar";
import { InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";
import { esquemaUsuariosType, TablaUsuarios } from "../../componentes/Tabla";
import { trpc } from "../../utils/trpc";
import { useEffect, useState } from "react";

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
const Usuarios = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [buscar, setBuscar] = useState<string>("");
    const usuarios = trpc.usuarios.listarUsuarios.useQuery({ like: buscar });
    const [esquemaData, setEsquemaData] = useState<esquemaUsuariosType>([]);
    useEffect(() => {
        if (usuarios.data) {
            setEsquemaData(usuarios.data.map((dato) => {
                return {
                    usuario: dato.usuario ?? "-",
                    email: dato.email ?? "-",
                    foto: dato.image ?? "-",
                    rol: dato.rol,
                    estado: dato.deleted_at ? `Inactivo desde ${dato.deleted_at}` : "Activo",
                }
            })
            );
        }
    }, [usuarios.data]);
    return (
        <div>
            <Topbar />
            <div className="flex flex-col px-4 mt-2">
                <div className="flex gap-4 text-gray-600">
                    <button className="bg-green-400 px-2 py-1 hover:bg-green-500">Registrar</button>
                    <button className="bg-yellow-400 px-2 py-1 hover:bg-yellow-500">Detalles</button>
                    <button className="bg-red-400 px-2 py-1 hover:bg-red-500">Dar de baja</button>
                    <button className="bg-cyan-400 px-2 py-1 hover:bg-cyan-500">Agregar foto</button>
                    <input className="border" placeholder="Buscar usuario..."
                        onChange={(e) => {
                            setBuscar(e.target.value);
                        }}>
                    </input>
                </div>
                <TablaUsuarios datos={esquemaData} />
            </div>
        </div>
    );
}
export default Usuarios;