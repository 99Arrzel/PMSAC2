import { getSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getServerSideProps } from "../pages/dashboard";

export function slashRemover(path: string) {
    /* Obtenemos el último */
    let ruta = path.split("/").pop();
    /* Removemos el slash */
    ruta = ruta?.replace("/", "");
    return ruta;
}

const Topbar = () => {

    const router = useRouter();
    console.log(slashRemover(router.asPath), "ruta");
    const [userData, setUserData] = useState<any>(null);
    useEffect(() => {
        getSession().then((data) => {
            console.log(data)
            setUserData(data);
        });
    }, []);

    return (
        <div className="flex bg-red-400 flex-wrap" >
            <div className="flex gap-2 mr-auto text-white">
                <Link href="/dashboard">
                    <button className={`bg-red-600 py-4 px-6 hover:bg-red-300 ${slashRemover(router.asPath) == "dashboard" ? "bg-red-800" : ""}`}>
                        Ultimos
                    </button>
                </Link>
                <Link href="/dashboard/usuarios">
                    <button className={`bg-red-600 py-4 px-6 hover:bg-red-300 ${slashRemover(router.asPath) == "usuarios" ? "bg-red-800" : ""}`}>
                        Usuario
                    </button>
                </Link>
                <Link href="/dashboard/personas">
                    <button className={`bg-red-600 py-4 px-6 hover:bg-red-300 ${slashRemover(router.asPath) == "personas" ? "bg-red-800" : ""}`}>
                        Personas
                    </button>
                </Link>
            </div>
            <div className="ml-auto flex gap-2">
                <div>
                    {userData ?

                        <div className="flex align-center py-2 gap-2">
                            <img className="w-10 h-10 rounded-full" src
                                ={userData.data?.image ?? "/default_user.png"} />
                            <p className="text-white self-center">Bienvenido {userData.data?.user.persona.nombre}</p>
                        </div>
                        : <p className="text-white">Cargando...</p>}

                </div>
                <button className="py-4 px-6 hover:bg-red-800 bg-red-600 text-white"
                    onClick={() => {
                        console.log("wtf")
                        signOut();
                    }}>Cerrar Sesión</button>
            </div>

        </div>
    );
}
export default Topbar;