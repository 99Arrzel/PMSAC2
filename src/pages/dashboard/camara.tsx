import CamaraComponente from "../../componentes/CamaraComponente"
import Topbar from "../../componentes/Topbar"
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

const Camara = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <Topbar />
            <div className="flex flex-col px-4 mt-2">
                <h1>Camara</h1>
                <CamaraComponente></CamaraComponente>
            </div>
        </>
    )
}
export default Camara