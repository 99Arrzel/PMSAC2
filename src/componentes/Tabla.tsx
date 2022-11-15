import zod, { z } from "zod";
/* Esquema de zod que tenga */
const esquemaUltimos = zod.object({
  nombre: zod.string(),
  apellido: zod.string(),
  carnet: zod.string(),
  foto: zod.string(),
  foto_ultimo_ingreso: zod.string(),
  hora_ultimo_ingreso: zod.string(),
}).array();


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
              <th className="px-4 py-2">Puesto</th>
              <th className="px-4 py-2">Carnet</th>
              <th className="px-4 py-2">Foto</th>
              <th className="px-4 py-2">Foto Ultimo Ingreso</th>
              <th className="px-4 py-2">Hora Ultimo Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => (
              <tr key={dato.carnet} className="even:bg-gray-200 bg-red-300">
                <td className="border px-4 py-2">{dato.nombre}</td>
                <td className="border px-4 py-2">{dato.apellido}</td>
                <td className="border px-4 py-2">{dato.carnet}</td>
                <td className="border px-4 py-2">
                  <img src={dato.foto} />
                </td>
                <td className="border px-4 py-2">
                  <img src={dato.foto_ultimo_ingreso} />
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
  agregado_en: zod.string(),
  actualizado_en: zod.string(),
  foto: zod.string(),
  rol: zod.string(),
  estado: zod.string(),
}).array();

export const TablaUsuarios = ({ datos }: { datos: z.infer<typeof esquemaUsuarios> }) => {
  return (
    <>
      <div className="px-5">
        <h1 className="text-2xl">Tabla de usuarios</h1>
        <table className="table-auto w-full">
          <thead className="bg-gray-200 text-center">
            <tr>
              <th className="px-4 py-2">Usuario</th>
              <th className="px-4 py-2">Agregado en</th>
              <th className="px-4 py-2">Actualizado en</th>
              <th className="px-4 py-2">Foto</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato) => (
              <tr key={dato.usuario} className="even:bg-gray-200 bg-red-300">
                <td className="border px-4 py-2">{dato.usuario}</td>
                <td className="border px-4 py-2">{dato.agregado_en}</td>
                <td className="border px-4 py-2">{dato.actualizado_en}</td>
                <td className="border px-4 py-2">
                  <img src={dato.foto
                  } />
                </td>
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
export default TablaUltimos;