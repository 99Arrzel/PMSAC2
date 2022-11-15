import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
/* Aquí guardamos datos del editar personas (Al dar click), que son:
    nombre
    apellido_p
    apellido_m
    carnet
    fecha_nacimiento
    telefono
    direccion
*/

import type { esquemaPersonasNAType } from '../Tabla';
/* Extendemos el type esquemaPersonasNAType y le damos los set */
type esquemaPersonasType = esquemaPersonasNAType & {
    setId: (id: number) => void;
    setNombre: (nombre: string) => void;
    setApellido_p: (apellido_p: string) => void;
    setApellido_m: (apellido_m: string) => void;
    setCarnet: (carnet: string) => void;
    setFecha_nacimiento: (fecha_nacimiento: Date | undefined) => void;
    setTelefono: (telefono: string) => void;
    setDireccion: (direccion: string) => void;
    setAll: (persona: esquemaPersonasNAType) => void;
};
/* Excluimos que sea array de esquemaPersonasType */

export const useDatosPersona = create<esquemaPersonasType>()(
    devtools(
        persist(
            (set, get) => ({
                id: 0,
                setId: (id: number) => set({ id }),
                nombre: '',
                setNombre: (nombre: string) => set({ nombre }),
                apellido_p: '',
                setApellido_p: (apellido_p: string) => set({ apellido_p }),
                apellido_m: '',
                setApellido_m: (apellido_m: string) => set({ apellido_m }),
                carnet: '',
                setCarnet: (carnet: string) => set({ carnet }),
                fecha_nacimiento: undefined,
                setFecha_nacimiento: (fecha_nacimiento: Date | undefined) => set({ fecha_nacimiento }),
                telefono: '',
                setTelefono: (telefono: string) => set({ telefono }),
                direccion: '',
                setDireccion: (direccion: string) => set({ direccion }),
                setAll: (persona: esquemaPersonasNAType) => set(persona),
            }),
            {
                name: 'datosPersona',
            }
        )
    )
);