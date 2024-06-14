import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import Webcam from "react-webcam";
import { trpc } from "../utils/trpc";
import { useDatosPersona } from "./ZustandStates/DatosPersona";
import * as faceApi from "face-api.js";
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Confirm } from "notiflix";
const AgregarFotosPersona = () => {
    const id = useDatosPersona(state => state.id);
    const context = trpc.useContext();
    const fotos = trpc.fotos.fotosPersona.useQuery({ persona_id: id });
    const [open, setOpen] = useState<boolean>(false);
    const nombre = useDatosPersona(state => state.nombre);
    const deleteFoto = trpc.fotos.eliminarFoto.useMutation({
        onSuccess: () => {
            context.fotos.invalidate(); //Recarga
            Loading.remove();
        }
    }
    );

    /* Datos de la webcam */
    const webcamRef = useRef<Webcam>(null);
    const uploadToServer = async () => {
        if (!webcamRef.current) return;
        console.log("intentando enviar")
        const body = new FormData();

        body.append("file", webcamRef.current.getScreenshot() ?? ""); //No file, lo validamos con onUserMedia
        body.append("persona_id", id.toString());
        const response = await fetch("/api/images/upload", {
            method: "POST",
            body
        });
        if (response.status === 201) {
            /* Esperamos 100ms antes de actualizar */
            setTimeout(() => {
                context.fotos.invalidate();
            }, 100);
            console.log("Revalidando")
        }
        Loading.remove();
    };
    const [disabled, setDisabled] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    /* Para la cámara */
    const loadModels = async () => {
        /* La carga es dinamica */
        await faceApi.nets.ssdMobilenetv1.load("/models/");
        console.log("epico")
    };
    useEffect(() => {
        if (open) loadModels().then(() => setLoading(false));
    }, [open]);
    const options = new faceApi.SsdMobilenetv1Options({ minConfidence: 0.5 });
    const result = async () => {
        if (!webcamRef.current?.getCanvas()) return;
        return await faceApi.detectSingleFace(webcamRef.current.getCanvas() as HTMLCanvasElement, options);
    }
    /* Contador de fps */
    const canvasCamera = useRef<HTMLCanvasElement>(null);
    const onUserMedia = useCallback(async () => {
        const res = await result();
        const ctx = canvasCamera.current?.getContext("2d");
        if (!ctx) return;
        if (res) {
            setDisabled(false);
            /* Dibujamos un cuadrado en el rostro */
            if (!canvasCamera) return;
            /* Limpiamos */
            ctx.clearRect(0, 0, canvasCamera.current?.width ?? 0, canvasCamera.current?.height ?? 0);
            /* Dibujamos */
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "green";
            ctx.rect(res.box.x, res.box.y, res.box.width, res.box.height);
            ctx.stroke();
            /* Le ponemos el score */
            ctx.font = "20px Arial";
            ctx.fillStyle = "green";
            ctx.fillText(res.score.toFixed(2).toString(), res.box.x, res.box.y + res.box.height + 20);
        } else {
            setDisabled(true);
            ctx.clearRect(0, 0, canvasCamera.current?.width ?? 0, canvasCamera.current?.height ?? 0);
        }
        setTimeout(() => {
            onUserMedia();


        }, 16.66);
    }, []);
    //Cada 1 sec se actualiza el contador de fps

    return (<>
        <button className="bg-cyan-400 px-2 py-1 hover:bg-cyan-500" onClick={() => {
            setOpen(true);
        }}>Agregar fotos</button>
        <Modal onClose={() => {

            setOpen(false);
        }} open={open}
            titulo={
                <h1 className="text-2xl">Agrega fotos a {nombre}</h1>
            }>
            {!loading ?
                (
                    <div className="flex w-full gap-4 pt-4">
                        {/* Un canvas que cubra la imagen */}
                        <canvas ref={canvasCamera} width={640} height={480} className="fixed"/>
                        
                        <Webcam ref={webcamRef} screenshotFormat="image/jpeg"
                            onUserMedia={onUserMedia}
                            onUserMediaError={() => {
                                setDisabled(true);
                            }}
                            videoConstraints={{
                                width: 640,
                                height: 480,
                                facingMode: "user"
                            }}

                        />
                        
                        <div className="w-80 overflow-scroll h-[480px] flex flex-col gap-2">
                            {fotos.data ? fotos?.data?.map((foto, index) => {
                                return (<>
                                    <div key={index} className="bg-gray-100">
                                        <button className="relative translate-y-6 bg-red-500 text-white px-2"
                                            onClick={() => {
                                                Confirm.show("¿Estás seguro?", "Se eliminará la foto", "Si", "No", () => {
                                                    Loading.pulse("Eliminando foto...");
                                                    deleteFoto.mutate({ id: foto.id });
                                                });
                                            }}>x</button>
                                        <img src={foto.foto_url.replace("./public", "")} alt="foto" />
                                    </div>
                                </>);
                            }) : null
                            }
                            {
                                fotos.data && fotos.data.length > 0 ? null : <div className="h-48 bg-gray-400 flex justify-center"><p className="text-white">No hay fotos</p></div>
                            }
                        </div>
                    </div>
                ) : <div className="flex justify-center items-center h-96"><p>Cargando modelos...</p></div>}
            <button className="bg-cyan-400 px-2 py-1 hover:bg-cyan-500 disabled:bg-gray-500" disabled={disabled} onClick={() => {
                uploadToServer();
                Loading.pulse("Subiendo foto...");
            }}>Tomar foto</button>
        </Modal>
    </>);
}
export default AgregarFotosPersona;