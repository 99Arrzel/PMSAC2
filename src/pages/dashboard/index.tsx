import { getToken } from "next-auth/jwt";
import { InferGetServerSidePropsType } from "next";
import Topbar from "../../componentes/Topbar";
import TablaUltimos from "../../componentes/Tabla";
import { trpc } from "../../utils/trpc";
import { useState } from "react";

export async function getServerSideProps(context: any) {
  /* Sessión de nextauth con jwt */
  const session = await getToken({
    req: context.req,
    secret: process.env.NEXTAUTH_SECRET,
  });
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
    props: {},
  };
}
const Dashboard = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [search, setSearch] = useState("");
  const ultimos = trpc.registros.listarRegistros.useQuery({
    take: 10,
    search,
  });
  return (
    <>
      <div>
        <Topbar />
        {ultimos.data ? (
          <TablaUltimos
            datos={ultimos.data.registros.map((registro) => {
              return {
                nombre: registro.persona.nombre,
                apellido: registro.persona.apellido_p,
                carnet: registro.persona.carnet,
                foto_ultimo_ingreso: registro.foto_url.replace("./public", ""),
                hora_ultimo_ingreso: registro.fecha.toLocaleString(),
              };
            })}
          />
        ) : null}
      </div>
    </>
  );
};
export default Dashboard;
