import { signIn } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";

export async function getServerSideProps(context: any) {
    const { query } = context;
    /* Sessión de nextauth con jwt */
    const session = await getToken({ req: context.req, secret: process.env.NEXTAUTH_SECRET });
    console.log(session, "token");
    if (session) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
    let error = "";
    if (Boolean(query.error)) {
        error = query.error;
    }
    return {
        props: {
            loginError: error,
        }
    };
}


function Login(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const tryLogin = async () => {
        await signIn("credentials", {
            redirect: true,
            username: (document.getElementById("username") as HTMLInputElement).value as string,
            password: (document.getElementById("password") as HTMLInputElement).value as string,
        })
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="w-full sm:w-1/2 lg:w-80">
                    <h1 className="text-center text-2xl">Login</h1>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4 flex flex-col gap-2">
                            <div className="self-center bg-red-400 px-10 py-2 mb-2">
                                <p className="text-2xl">Logo</p>
                            </div>
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Usuario"
                            />
                            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="Contraseña"
                            />
                            <div className="self-center">
                                <button className="bg-yellow-900 px-4 text-white"
                                    onClick={
                                        tryLogin
                                    }>Ingresar</button>
                            </div>
                            {props.loginError && <p className="text-red-500 text-center">{props.loginError}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Login;