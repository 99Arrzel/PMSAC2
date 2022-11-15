import { getToken } from "next-auth/jwt";
import type { InferGetServerSidePropsType } from "next";

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
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}
export default function Redirect(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div>Redireccionando...</div>;
}
