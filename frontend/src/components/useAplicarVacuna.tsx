'use client';

import { useState } from 'react';
import { useAplicarVacuna } from '@/hook/useAplicarVacuna';

export default function AplicarVacuna() {
  const { aplicar, cargando, error, exito, setError } = useAplicarVacuna();

  const [mascotaId, setMascotaId] = useState('');
  const [vacunaId, setVacunaId] = useState('');
  const [costo, setCosto] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mascotaId || !vacunaId || !costo) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const idMascotaNum = parseInt(mascotaId, 10);
    const idVacunaNum = parseInt(vacunaId, 10);
    const costoNum = parseFloat(costo);
    if (costoNum < 0) {
      setError('El costo no puede ser negativo.');
      return;
    }

    const fueExitoso = await aplicar(idMascotaNum, idVacunaNum, costoNum);

    if (fueExitoso) {
      setMascotaId('');
      setVacunaId('');
      setCosto('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Aplicar Vacuna</h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Al guardar, el sistema de Node.js destruirá la memoria de Redis para forzar una actualización en Recepción.
      </p>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      {exito && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded mb-4 text-sm">
           {exito}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Paciente</label>
            <input
              type="number" min="1" value={mascotaId}
              onChange={(e) => setMascotaId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Vacuna</label>
            <input
              type="number" min="1" value={vacunaId}
              onChange={(e) => setVacunaId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo Cobrado ($)</label>
          <input
            type="number" step="0.01" min="0" value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. 450.00"
          />
        </div>

        <button
          type="submit" disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold
           py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-400 mt-2"
        >
          {cargando ? 'Registrando...' : 'Registrar Aplicación'}
        </button>
      </form>
    </div>
  );
}