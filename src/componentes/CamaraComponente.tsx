import { Confirm } from "notiflix";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceApi from "face-api.js";
import { trpc } from "../utils/trpc";
import { getSession } from "next-auth/react";


const CamaraComponente = () => {
    /* Marcar asistencia */
    let session: any;
    console.log(session)
    const marcarAsistencia = trpc.registros.nuevoRegistro.useMutation(

    );

    const loadModels = async () => {
        /* La carga es dinamica */
        await faceApi.nets.ssdMobilenetv1.load("/models/");
        console.log("epico")
    };
    useEffect(() => {
        loadModels();
        getSession().then((data) => {
            session = data;
        });
    }, []);

    const webcamRef = useRef<Webcam>(null);
    const canvasCamera = useRef<HTMLCanvasElement>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [datoLoggin, setDatoLoggin] = useState<string>("Identificate");
    const options = new faceApi.SsdMobilenetv1Options({ minConfidence: 0.6 });
    const responseRef = useRef<HTMLDivElement>(null);
    const result = async () => {
        if (!webcamRef.current?.getCanvas()) return;
        return await faceApi.detectSingleFace(webcamRef.current.getCanvas() as HTMLCanvasElement, options);
    }
    let loginTimeout: ReturnType<typeof setTimeout>;
    /* Contador para hacerle throttle al login */
    useEffect(() => {
        /* Cada vez que se logea, queremos que vuelva a identificate después de 3 sec*/
        clearTimeout(loginTimeout); //Limpiamos el último timoeut y seteamos uno nuevo, así no se repite el timeout
        // eslint-disable-next-line react-hooks/exhaustive-deps
        loginTimeout = setTimeout(() => {
            setLoggedIn(false);
            setDatoLoggin("Identificate");
        }
            , 3000);
    }, [loggedIn])
    const onUserMedia = useCallback(async () => {
        const res = await result();
        const ctx = canvasCamera.current?.getContext("2d");
        if (!ctx) return;
        if (res) {
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
            /* Ahora intentamos marcar asistencia */

            /* Marcar asistencia */
            const mAsistencia = await marcarAsistencia.mutateAsync({ foto: webcamRef.current?.getScreenshot() ?? "", camara_id: Number(session.data.id) });
            console.log("xddd")

            if (mAsistencia.exito && mAsistencia.similaridad) {
                console.log("xd")
                setDatoLoggin(`Bienvenido ${mAsistencia.persona?.nombre ?? ""} ${mAsistencia.similaridad.toFixed(2).toString()} `);

                /* Ponemos el color de fondo verde */
                setLoggedIn(true);
                /* Finalmente un timeout para volverlo a la normalidad
                 */
            } else {
                setLoggedIn(false);
                setDatoLoggin(mAsistencia.message);
            }

        } else {
            ctx.clearRect(0, 0, canvasCamera.current?.width ?? 0, canvasCamera.current?.height ?? 0);
        }
        setTimeout(() => {
            onUserMedia();
        }, 16.66);
    }, []);
    return (<>
        <div className="h-[640] w-[480px]">
            <canvas ref={canvasCamera} height={640} width={480} className="fixed">
            </canvas>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg"
                onUserMedia={onUserMedia}

                onUserMediaError={() => {
                    Confirm.show("Error", "No se pudo acceder a la camara", "Ok");
                }}
                videoConstraints={{
                    width: 480,
                    height: 640,
                    facingMode: "user"
                }}
            />
            <div className={`h-10 w-full text-2xl text-white text-center -translate-y-10 ${loggedIn ? "bg-green-500" : "bg-red-500"}`} ref={responseRef}>{datoLoggin}</div>
        </div>
    </>)
}
export default CamaraComponente;