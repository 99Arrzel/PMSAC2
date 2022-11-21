import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Modal } from "./Modal";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const CrearPersona = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [nombre, setNombre] = useState<string>("");
    const [apellido_p, setApellido_p] = useState<string>("");
    const [apellido_m, setApellido_m] = useState<string>("");
    const [carnet, setCarnet] = useState<string>("");
    const crearPersona = trpc.personas.crearPersona.useMutation({
        onSuccess: () => {
            setOpen(false);
            setNombre("");
            setApellido_p("");
            setApellido_m("");
            setCarnet("");
            crearPersona.reset();
            context.personas.invalidate();
            Notify.success("Persona creada con éxito", {
                position: "right-bottom",
                timeout: 3000,
                clickToClose: true,
            });
        },
        onError: () => {
            Notify.failure("No se pudo crear la persona", {
                position: "right-bottom",
                timeout: 3000,
                clickToClose: true,
            });
        }
    });
    const context = trpc.useContext();
    const crearPersonaHandler = () => {
        crearPersona.mutate({
            nombre,
            apellido_p,
            apellido_m,
            carnet,
        })

    }
    return (
        <>
            {/* En el modal, 4 datos primarios para crear una persona: nombre, apellido_p, apellido_m y carnet*/}
            <button className="bg-green-400 px-2 py-1 hover:bg-green-500" onClick={() => {
                setOpen(true);
            }}>Registrar</button>
            <Modal
                titulo={
                    <h1 className="text-2xl">Registrar persona</h1>
                }
                onClose={() => {
                setOpen(false);
            }} open={open}>
                <div className="flex flex-col gap-4 p-4">
                    <p className="text-center text-xl">Crear una persona</p>
                    <input className="border" placeholder="Nombre"
                        onChange={(e) => {
                            setNombre(e.target.value);
                        }} value={nombre}></input>
                    <input className="border" placeholder="Apellido paterno"
                        onChange={(e) => {
                            setApellido_p(e.target.value);
                        }} value={apellido_p}></input>
                    <input className="border" placeholder="Apellido materno"
                        onChange={(e) => {
                            setApellido_m(e.target.value);
                        }} value={apellido_m}
                    ></input>
                    <input className="border" placeholder="Carnet"
                        onChange={(e) => {
                            setCarnet(e.target.value);
                        }} value={carnet}></input>
                    <button className="bg-green-500 disabled:bg-gray-500" disabled={crearPersona.isLoading} onClick={() => {
                        crearPersonaHandler();
                    }}>Crear</button>
                </div>

            </Modal>
        </>
    );

}
export default CrearPersona;