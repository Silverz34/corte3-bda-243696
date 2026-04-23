'use client';

import { useEffect } from 'react';
import { useVacunas } from '@/hook/useVacuna';

export default function VacunasPendientes() {
  const { pendientes, cargando, error, obtenerPendientes } = useVacunas();

  useEffect(() => {
    obtenerPendientes();
  }, []);

  const obtenerColorPrioridad = (prioridad: string) => {
    const texto = prioridad.toLowerCase();
    if (texto.includes('nunca_vacunada')) return 'bg-red-100 text-red-800 border-red-200';
    if (texto.includes('vencida')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200'; 
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 overflow-hidden">
      
      {/* CABECERA CON BADGE DE REDIS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Campaña de Vacunación</h2>
          <p className="text-sm text-gray-500">
            Pacientes que requieren seguimiento (Datos cacheados en memoria).
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={obtenerPendientes}
            disabled={cargando}
            className="bg-blue-600 hover:bg-blue-400 text-gray-200 font-medium py-1.5 px-4 rounded-lg
             transition-colors disabled:opacity-50 text-sm border border-gray-300"
          >
            {cargando ? 'Consultando...' : 'Recargar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* TABLA DE DATOS */}
      {cargando && pendientes.length === 0 ? (
        <div className="text-center py-10 text-gray-500 animate-pulse">
          Consultando a la base de datos...
        </div>
      ) : pendientes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-purple-50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Paciente</th>
                <th className="px-4 py-3">Dueño / Contacto</th>
                <th className="px-4 py-3">Última Vacuna</th>
                <th className="px-4 py-3 text-center">Días Pasados</th>
                <th className="px-4 py-3 rounded-tr-lg">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((fila, index) => (
                // Usamos el index porque la vista SQL no nos trae un ID único
                <tr key={`${fila.nombre_mascota}-${index}`} className="bg-white border-b hover:bg-gray-50 transition-colors">
                  
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">{fila.nombre_mascota}</div>
                    <div className="text-xs text-gray-500 capitalize">{fila.especie}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="font-medium text-gray-800">{fila.nombre_dueno}</div>
                    <div className="text-xs text-blue-600 font-mono mt-0.5">{fila.telefono_dueno}</div>
                  </td>
                  
                  <td className="px-4 py-4">
                    {fila.fecha_ultima_vacuna 
                      ? new Date(fila.fecha_ultima_vacuna).toLocaleDateString() 
                      : 'Sin registro'}
                  </td>
                  
                  <td className="px-4 py-4 text-center font-bold text-gray-700">
                    {fila.dias_desde_ultima_vacuna}
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded border ${obtenerColorPrioridad(fila.prioridad)}`}>
                      {fila.prioridad.toUpperCase()}
                    </span>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No hay vacunas pendientes en este momento.
        </div>
      )}
    </div>
  );
}