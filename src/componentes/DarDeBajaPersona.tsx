import { Confirm, Notify } from "notiflix";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Modal } from "./Modal";
import { useDatosPersona } from "./ZustandStates/DatosPersona";

useDatosPersona
const DarDeBajaPersona = () => {
    const id = useDatosPersona(state => state.id);
    const context = trpc.useContext();
    const darDeBajaPersona = trpc.personas.deBajaPersona.useMutation({
        onSuccess: () => {
            context.personas.invalidate();
        },
    });
    const darDeBajaPersonaHandler = () => {
        Confirm.show("Dar de baja/restaurar", "¿Está seguro de dar de baja/restaurar a esta persona?", "Si", "No", () => {
            darDeBajaPersona.mutate({ id });
            Notify.success("Persona dada de baja/restaurada correctamente", {
                position: "right-bottom",
                timeout: 3000,
                clickToClose: true,
            });
        });
    };
    return (
        <>
            <button className="bg-red-400 px-2 py-1 hover:bg-red-500 disabled:bg-gray-400" disabled={id === 0} onClick={() => {
                darDeBajaPersonaHandler();
            }}>Dar de baja / Restaurar</button>
        </>
    );
}
export default DarDeBajaPersona