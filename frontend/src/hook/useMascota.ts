'use client';

import { useState } from 'react';
import { useApiClient } from './useApi';
import { ApiError } from './apiError';
import { Mascota } from '@/interface/Mascota';

export const useMascotas = () => {
  const { apiGet } = useApiClient();

  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState<boolean>(false);

  const buscarMascotas = async (terminoBusqueda: string): Promise<void> => {
    setCargando(true);
    setError(null);
    setBusquedaRealizada(true);
    try {
      const respuesta = await apiGet<Mascota[]>(`/mascotas?q=${encodeURIComponent(terminoBusqueda)}`);
      setMascotas(respuesta.data || []);
      
    } catch (err: unknown) { 
      if (err instanceof ApiError) {

        setError(err.message);
      } else if (err instanceof Error) {

        setError(err.message);

      } else {
        
        setError('Ocurrió un error inesperado al buscar mascotas.');
      }
      setMascotas([]);
    } finally {
      setCargando(false);
    }
  };

 
  return {
    mascotas,
    cargando,
    error,
    busquedaRealizada,
    buscarMascotas,
  };
};