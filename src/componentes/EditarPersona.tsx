import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Modal } from "./Modal";
import { useDatosPersona } from "./ZustandStates/DatosPersona";
const EditarPersona = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [id, setId] = useDatosPersona(state => [state.id, state.setId]);
    const [nombre, setNombre] = useDatosPersona(state => [state.nombre, state.setNombre]);
    const [apellido_p, setApellido_p] = useDatosPersona(state => [state.apellido_p, state.setApellido_p]);
    const [apellido_m, setApellido_m] = useDatosPersona(state => [state.apellido_m, state.setApellido_m]);
    const [carnet, setCarnet] = useDatosPersona(state => [state.carnet, state.setCarnet]);
    const [fecha_nacimiento, setFecha_nacimiento] = useDatosPersona(state => [state.fecha_nacimiento, state.setFecha_nacimiento]);
    const [telefono, setTelefono] = useDatosPersona(state => [state.telefono, state.setTelefono]);
    const [direccion, setDireccion] = useDatosPersona(state => [state.direccion, state.setDireccion]);
    const context = trpc.useContext();
    const editarPersona = trpc.personas.editarPersona.useMutation({
        onSuccess: () => {
            setOpen(false);
            setId(0);
            setNombre("");
            setApellido_p("");
            setApellido_m("");
            setCarnet("");
            setFecha_nacimiento(undefined);
            setTelefono("");
            setDireccion("");
            context.personas.invalidate();
        },
    });
    const editarPersonaHandler = () => {
        editarPersona.mutate({
            id,
            nombre,
            apellido_p,
            apellido_m,
            carnet,
            fecha_nacimiento,
            telefono,
            direccion,
        });
    };
    return (
        <>
            <button className={`bg-yellow-400 px-2 py-1 hover:bg-yellow-500 disabled:bg-gray-400`} disabled={id === 0}
                onClick={() => {
                    setOpen(true);
                }}
            >Editar</button>
            <Modal
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
            >
                <div className="flex flex-col gap-4 p-4">
                    <p className="text-center text-xl">Editar una persona</p>
                    <input className="border" placeholder="Nombre" value={nombre} onChange={(e) => {
                        setNombre(e.target.value);
                    }}></input>
                    <input className="border" placeholder="Apellido paterno" value={apellido_p} onChange={
                        (e) => {
                            setApellido_p(e.target.value);
                        }
                    }></input>
                    <input className="border" placeholder="Apellido materno" value={apellido_m} onChange={
                        (e) => {
                            setApellido_m(e.target.value);
                        }

                    }></input>
                    <input className="border" placeholder="Carnet" value={carnet} onChange={
                        (e) => {
                            setCarnet(e.target.value);
                        }

                    }></input>
                    <input className="border" type="date" placeholder="Fecha de nacimiento" value={typeof fecha_nacimiento === 'function' ? fecha_nacimiento.toLocaleDateString('en-CA') : undefined} onChange={
                        (e) => {
                            setFecha_nacimiento(new Date(e.target.value));
                        }
                    } ></input>
                    <input className="border" placeholder="Telefono" value={telefono ?? ""} onChange={
                        (e) => {
                            setTelefono(e.target.value);
                        }
                    }></input>
                    <input className="border" placeholder="Dirección" value={direccion ?? ""} onChange={
                        (e) => {
                            setDireccion(e.target.value);
                        }
                    }></input>
                    <button className="bg-green-500" onClick={() => {
                        editarPersonaHandler();
                    }} disabled={editarPersona.isLoading}>Editar</button>
                </div>

            </Modal>
        </>
    );
}
export default EditarPersona;