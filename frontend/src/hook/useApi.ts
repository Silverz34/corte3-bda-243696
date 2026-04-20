'use client';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from './apiError';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


export const useApiClient = () => {
  const { rol, vetId } = useAuth();
  const BASE = process.env.API_URL || 'http://localhost:8080/api';

    //Función central de peticiones
    const request = async <T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> => {
    
    // Construimos los headers inyectando el rol y el ID 
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (rol) headers['x-rol'] = rol;
    if (vetId) headers['x-vet-id'] = vetId;

    const res = await fetch(new URL(path, BASE).toString(), {
      method,
      headers,
      ...(body !== undefined && { body: JSON.stringify(body) }),
      cache: 'no-store', 
    });

    if (res.status === 204) {
      return { success: true, data: undefined as T };
    }

    let json;
    try {
      json = await res.json();
    } catch {
      throw new ApiError(res.status, `Error ${res.status}: la respuesta no es un JSON válido`);
    }

    // Si la API de Express devuelve un error (ej. 400 o 500)
    if (!res.ok) {
      throw new ApiError(res.status, json.error || json.message || `Error ${res.status}`);
    }

    //Adaptamos la respuesta de nuestra API de Express a tu interfaz ApiResponse
    return {
      success: true,
      message: json.mensaje,
      data: json.cita || json // Si trae la propiedad cita, la devolvemos, si no, devolvemos todo
    };
  };

   // Exportamos los métodos CRUD limpios para usarse en los componentes
  return {
    apiGet: <T>(path: string) => request<T>('GET', path),
    apiPost: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
    apiPatch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
    apiDelete: <T>(path: string) => request<T>('DELETE', path),
  };
};