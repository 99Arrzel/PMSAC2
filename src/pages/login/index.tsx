import { signIn } from "next-auth/react";
import { InferGetServerSidePropsType } from "next";
import { getToken } from "next-auth/jwt";

export async function getServerSideProps(context: any) {
  const { query } = context;
  /* Sessión de nextauth con jwt */
  const session = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  });
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
    },
  };
}

import bcrypt from "bcryptjs";
function Login(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const tryLogin = async () => {
    await signIn("credentials", {
      redirect: true,
      username: (document.getElementById("username") as HTMLInputElement)
        .value as string,
      password: (document.getElementById("password") as HTMLInputElement)
        .value as string,
    });
  };

  return (
    <>
      
      <div className="flex flex-col h-screen items-center justify-center">
        {/* <p>Hash:123 ={bcrypt.hash("123")}</p> */}
        
        <div className="w-full sm:w-1/2 lg:w-80">
          <h1 className="text-center text-2xl">Login</h1>
          
          <div className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md">
            <div className="mb-4 flex flex-col gap-2">
              <div className="mb-2 self-center bg-red-400 px-10 py-2">
                <p className="text-2xl">Logo</p>
              </div>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="username"
                type="text"
                placeholder="Usuario"
              />
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="password"
                type="password"
                placeholder="Contraseña"
              />
              <div className="self-center">
                <button
                  className="bg-yellow-900 px-4 text-white"
                  onClick={tryLogin}
                >
                  Ingresar
                </button>
              </div>
              {props.loginError && (
                <p className="text-center text-red-500">{props.loginError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Login;
