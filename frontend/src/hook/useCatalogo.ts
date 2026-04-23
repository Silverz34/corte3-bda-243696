'use client';

import { useState, useEffect } from 'react';
import { useApiClient } from './useApi';
import { MascotaCatalogo, VacunaCatalogo, VeterinarioCatalogo} from '@/interface/datosBase';


export const useCatalogos = () => {
  const { apiGet } = useApiClient();
  const [listaMascotas, setListaMascotas] = useState<MascotaCatalogo[]>([]);
  const [listaVacunas, setListaVacunas] = useState<VacunaCatalogo[]>([]);
  const [listaVeterinarios, setListaVeterinarios] = useState<VeterinarioCatalogo[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState<boolean>(true);

  useEffect(() => {
    const cargarCatalogos = async () => {
      setCargandoCatalogos(true);
      try {
      
        const [resMascotas, resVacunas, resVeterinarios] = await Promise.all([
          apiGet<MascotaCatalogo[]>('/mascotas?q='),
          apiGet<VacunaCatalogo[]>('/vacunas/nombres'), 
          apiGet<VeterinarioCatalogo[]>('/veterinarios/nombres')
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
  }, []);

  return {
    listaMascotas,
    listaVacunas,
    listaVeterinarios,
    cargandoCatalogos
  };
};