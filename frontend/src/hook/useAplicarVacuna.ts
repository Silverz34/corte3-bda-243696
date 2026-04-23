'use client';

import { useState } from 'react';
import { useApiClient } from './useApi';
import { ApiError } from './apiError';
import { cita } from '@/interface/cita';


export const useAplicarVacuna = () => {
  const { apiPost } = useApiClient();
  
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const aplicar = async (mascota_id: number, vacuna_id: number, costo_cobrado: number) => {
    setCargando(true);
    setError(null);
    setExito(null);

    try {
      const respuesta = await apiPost<cita[]>('/vacunas/aplicar', {
        mascota_id,
        vacuna_id,
        costo_cobrado
      });

      setExito(respuesta.message || 'Vacuna aplicada y caché invalidado.');
      return true; 
      
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al aplicar la vacuna.');
      }
      return false;
    } finally {
      setCargando(false);
    }
  };

  return { aplicar, cargando, error, exito, setError };
};