'use client'
import { useState } from "react";
import { useApiClient} from "./useApi";
import { ApiError } from "./apiError";
import { VacunaPendiente } from "@/interface/vacunaPend";


export const useVacunas = () =>{
  const {apiGet} = useApiClient();

  const [pendientes, setPendientes] = useState<VacunaPendiente[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerPendiente = async () =>{
     setCargando(true);
     setError(null);
     
        try{

            const respuesta = await apiGet<VacunaPendiente[]>('/vacunas/pendientes');
            setPendientes(respuesta.data || []);

        }catch( err: unknown){
            if(err instanceof ApiError){
                setError(err.message);
            }else if(err instanceof Error){
                setError(err.message);
            }else{
                setError('error al obtener las vacunas pendientes');
            }
        }finally{
            setCargando(false);
        }
    };
    return {
        pendientes, 
        cargando,
        error, 
        obtenerPendiente
    };
};
