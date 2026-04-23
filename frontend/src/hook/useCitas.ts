'use client';
import { ApiError } from './apiError';
import { useState } from 'react';
import { useApiClient } from './useApi';
import { cita } from '@/interface/cita';

export const useCitas = () => {
  const { apiPost } = useApiClient();
  
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const agendarCita = async (mascota_id: number, fecha_hora: string, motivo: string) => {
    setCargando(true);
    setError(null);
    setExito(null);

    try {
      const respuesta = await apiPost<cita[]>('/citas/agendar');
      setExito(respuesta.message || 'Cita agendada con éxito.');
      return true; 
      
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al agendar la cita.');
      }
      return false;
    } finally {
      setCargando(false);
    }
  };

  return {
    agendarCita,
    cargando,
    error,
    exito,
    setError 
  };
};