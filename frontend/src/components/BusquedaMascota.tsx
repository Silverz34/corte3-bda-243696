'use client';

import { useState } from 'react';
import { useMascotas } from '@/hook/useMascota';

export default function BusquedaMascotas() {
  const [termino, setTermino] = useState<string>('');
  const { mascotas, cargando, error, busquedaRealizada, buscarMascotas } = useMascotas();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    buscarMascotas(termino);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Búsqueda de Pacientes</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Ej. Firulais"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={cargando}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-blue-400"
        >
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </form>


      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}


      {mascotas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Especie</th>
                <th className="px-4 py-3">Nacimiento</th>
              </tr>
            </thead>
            <tbody>
              {mascotas.map((mascota) => (
                <tr key={mascota.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{mascota.id}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{mascota.nombre}</td>
                  <td className="px-4 py-3 capitalize">{mascota.especie}</td>
                  <td className="px-4 py-3">
                    {new Date(mascota.fecha_nacimiento).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (

        busquedaRealizada && !cargando && !error && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            No se encontraron mascotas con ese nombre (o no tienes permisos para verlas).
          </div>
        )
      )}
    </div>
  );
}