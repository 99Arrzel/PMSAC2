import { useCallback, useRef, useState } from "react";
import { Modal } from "./Modal";
import Webcam from "react-webcam";
import { trpc } from "../utils/trpc";
import { useDatosPersona } from "./ZustandStates/DatosPersona";
const AgregarFotosPersona = () => {
    const id = useDatosPersona(state => state.id);
    const context = trpc.useContext();
    const fotos = trpc.fotos.fotosPersona.useQuery({ persona_id: id });
    const [open, setOpen] = useState<boolean>(false);

    /* Datos de la webcam */
    const webcamRef = useRef(null);
    const uploadToServer = async () => {
        if (!webcamRef.current) return;
        console.log("intentando enviar")
        const body = new FormData();
        body.append("file", webcamRef?.current?.getScreenshot());
        body.append("persona_id", id.toString());
        const response = await fetch("/api/images/upload", {
            method: "POST",
            body
        });
        if (response.status === 201) {
            context.fotos.invalidate(); //Refrescar la lista de fotos
        }
    };
    const [disabled, setDisabled] = useState<boolean>(true);


    return (<>
        <button className="bg-cyan-400 px-2 py-1 hover:bg-cyan-500" onClick={() => {
            setOpen(true);
        }}>Agregar fotos</button>
        <Modal onClose={() => {
            setOpen(false);
        }} open={open}>
            <div className="flex w-full gap-4 pt-10">
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg"
                    onUserMedia={() => {
                        setDisabled(false);
                    }}
                    onUserMediaError={() => {
                        setDisabled(true);
                    }}
                />

                <div className="w-80">
                    {fotos.data ? fotos?.data?.map((foto, index) => {
                        return (<>
                            <div className="bg-gray-100">
                                <img key={index} src={foto.foto_url} alt="foto" />
                            </div>
                        </>);
                    }) : null
                    }
                    {
                        fotos.data && fotos.data.length > 0 ? null : <div className="h-48 bg-gray-400 flex justify-center"><p className="text-white">No hay fotos</p></div>
                    }

                </div>
            </div>
            <button className="bg-cyan-400 px-2 py-1 hover:bg-cyan-500 disabled:bg-gray-500" disabled={disabled} onClick={() => {
                uploadToServer();
            }}>Tomar foto</button>
        </Modal>
    </>);
}
export default AgregarFotosPersona;