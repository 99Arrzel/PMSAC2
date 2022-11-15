import { getToken } from "next-auth/jwt";
import { InferGetServerSidePropsType } from "next";
import Topbar from "../../componentes/Topbar";
import TablaUltimos from "../../componentes/Tabla";

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
const Dashboard = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
        <>
            <div>
                <Topbar />
                <TablaUltimos datos={[]} />
            </div>
        </>
    );
};
export default Dashboard;