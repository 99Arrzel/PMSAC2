import Topbar from "../../componentes/Topbar";
import { InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";
import { TablaUsuarios } from "../../componentes/Tabla";

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
    return (
        <div>
            <Topbar />
            <div className="flex flex-col px-4 mt-2">
                <div className="flex gap-4 text-gray-600">
                    <button className="bg-green-400 px-2 py-1 hover:bg-green-500">Registrar</button>
                    <button className="bg-yellow-400 px-2 py-1 hover:bg-yellow-500">Detalles</button>
                    <button className="bg-red-400 px-2 py-1 hover:bg-red-500">Dar de baja</button>
                    <button className="bg-cyan-400 px-2 py-1 hover:bg-cyan-500">Agregar fotos</button>
                </div>
                <TablaUsuarios datos={[]} />
            </div>
        </div>
    );
}
export default Usuarios;