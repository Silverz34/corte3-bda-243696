'use client';
import { useState, useEffect } from 'react';
import { useApiClient } from './useApi';

export const useCatalogos = () => {
  const { apiGet } = useApiClient();

  const [listaMascotas, setListaMascotas] = useState<any[]>([]);
  const [listaVacunas, setListaVacunas] = useState<any[]>([]);
  const [listaVeterinarios, setListaVeterinarios] = useState<any[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setCargandoCatalogos(true);
      try {
        const [resMascotas, resVacunas, resVeterinarios] = await Promise.all([
          apiGet<any[]>('/mascotas?q='),
          apiGet<any[]>('/vacunas'), 
          apiGet<any[]>('/veterinarios')
        ]);

        setListaMascotas(resMascotas.data || []);
        setListaVacunas(resVacunas.data || []);
        setListaVeterinarios(resVeterinarios.data || []);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
      } finally {
        setCargandoCatalogos(false);
      }
    };

    cargarCatalogos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    listaMascotas,
    listaVacunas,
    listaVeterinarios,
    cargandoCatalogos
  };
};