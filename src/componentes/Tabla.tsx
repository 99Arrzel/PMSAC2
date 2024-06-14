import type { z } from "zod";
import zod from "zod";
import { useDatosPersona } from "./ZustandStates/DatosPersona";
/* Esquema de zod que tenga */
const esquemaUltimos = zod.object({
  nombre: zod.string(),
  apellido: zod.string(),
  carnet: zod.string(),
  id: zod.number(),
  foto_ultimo_ingreso: zod.string(),
  hora_ultimo_ingreso: zod.string(),
}).array();
export type esquemaUltimosType = z.infer<typeof esquemaUltimos>;
const isEmpty = (array: esquemaUltimosType | esquemaPersonasType | esquemaUsuariosType, nargs: number) => {
  if (array.length === 0) {
    /* Una fila de la tabla vacia */
    return (
      <tr>
        <td colSpan={nargs} className="border px-4 py-2">No hay datos</td>
      </tr>
    )
  }
  return null;
}


const TablaUltimos = ({ datos }: { datos: z.infer<typeof esquemaUltimos> }) => {
  return (
    <>
      <div className="px-5">
        <h1 className="text-2xl">Tabla de registro diario</h1>
        <table className="table-auto w-full">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido</th>

              <th className="px-4 py-2">Carnet</th>
              <th className="px-4 py-2">Foto Ultimo Ingreso</th>
              <th className="px-4 py-2">Hora Ultimo Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty(datos, 7)}
            {datos.map((dato) => (
              <tr key={dato.id} className="even:bg-gray-200 bg-red-300">
                <td className="border px-4 py-2">{dato.nombre}</td>
                <td className="border px-4 py-2">{dato.apellido}</td>
                <td className="border px-4 py-2">{dato.carnet}</td>
                <td className="border py-2 mx-auto">
                  <img src={dato.foto_ultimo_ingreso} className="h-40 w-40 object-cover" />
                </td>
                <td className="border px-4 py-2">{dato.hora_ultimo_ingreso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>);
}
const esquemaUsuarios = zod.object({
  usuario: zod.string(),
  email: zod.string().nullish(),
  foto: zod.string(),
  rol: zod.string(),
  estado: zod.string(),
}).array();
export type esquemaUsuariosType = z.infer<typeof esquemaUsuarios>;

export const TablaUsuarios = ({ datos }: { datos: z.infer<typeof esquemaUsuarios> }) => {
  return (
    <>
      <div className="px-5">
        <h1 className="text-2xl">Tabla de usuarios</h1>
        <table className="table-auto w-full">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Foto</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty(datos, 5)}
            {datos.map((dato) => (
              <tr key={dato.usuario} className="even:bg-gray-200 bg-red-300">
                <td className="border px-4 py-2">{dato.usuario}</td>
                <td className="border px-4 py-2">
                  <img src={dato.foto
                  } />
                </td>
                <td className="border px-4 py-2">{dato.email ?? "-"}</td>
                <td className="border px-4 py-2">{dato.rol}</td>
                <td className="border px-4 py-2">{dato.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </>
  );
}
const esquemaPersonasNA = zod.object({
  id: zod.number(),
  nombre: zod.string(),
  apellido_p: zod.string(),
  apellido_m: zod.string(),
  carnet: zod.string(),
  fecha_nacimiento: zod.date().nullish(),
  telefono: zod.string().nullish(),
  direccion: zod.string().nullish(),
  deleted_at: zod.date().nullish(),

});
const esquemaPersonas = esquemaPersonasNA.array();
export type esquemaPersonasType = z.infer<typeof esquemaPersonas>;
export type esquemaPersonasNAType = z.infer<typeof esquemaPersonasNA>;
export const TablaPersonas = ({ datos }: { datos: z.infer<typeof esquemaPersonas> }) => {
  const setAll = useDatosPersona((state) => state.setAll);
  const id = useDatosPersona((state) => state.id);
  return (
    <>
      <div className="px-5">
        <h1 className="text-2xl">Tabla de personas</h1>
        <table className="table-auto w-full">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Apellido Paterno</th>
              <th className="px-4 py-2">Apellido Materno</th>
              <th className="px-4 py-2">Carnet</th>
              <th className="px-4 py-2">Fecha de nacimiento</th>
              <th className="px-4 py-2">Telefono</th>
              <th className="px-4 py-2">Direccion</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {isEmpty(datos, 7)}
            {datos.map((dato) => (
              <tr key={dato.carnet} className={` ${dato.id == id ? 'bg-gray-400' : 'bg-red-300 even:bg-gray-200 hover:bg-red-200'}`} onClick={
                () => {
                  /* Establecemos los datos de zustand */
                  setAll(dato);
                  console.log(id)
                }

              }>

                <td className="border px-4 py-2">{dato.nombre}</td>
                <td className="border px-4 py-2">{dato.apellido_p}</td>
                <td className="border px-4 py-2">{dato.apellido_m}</td>
                <td className="border px-4 py-2">{dato.carnet}</td>
                <td className="border px-4 py-2">{dato.fecha_nacimiento ? dato.fecha_nacimiento.toLocaleDateString() : undefined}</td>
                <td className="border px-4 py-2">{dato.telefono}</td>
                <td className="border px-4 py-2">{dato.direccion}</td>
                <td className="border px-4 py-2">{dato.deleted_at ? `Baja desde ${dato.deleted_at?.toDateString()}` : "Activo"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TablaUltimos;
