'use client';

import { useState } from 'react';
import { useAplicarVacuna } from '@/hook/useAplicarVacuna';
import { useCatalogos } from '@/hook/useCatalogo';

export default function AplicarVacuna() {
  const { aplicar, cargando, error, exito, setError } = useAplicarVacuna();
  const { listaMascotas, listaVacunas, cargandoCatalogos } = useCatalogos(); 

  const [mascotaId, setMascotaId] = useState('');
  const [vacunaId, setVacunaId] = useState('');
  const [costo, setCosto] = useState('');
  const handleCambioVacuna = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idSeleccionado = e.target.value;
    setVacunaId(idSeleccionado);

    if (idSeleccionado === '') {
      setCosto('');
      return;
    }

    const vacunaEncontrada = listaVacunas.find(v => v.id.toString() === idSeleccionado);
    if (vacunaEncontrada && vacunaEncontrada.precio) {
      setCosto(vacunaEncontrada.precio.toString());
    }
  };

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

  if (cargandoCatalogos) {
    return <div className="p-6 text-center text-gray-500 animate-pulse">Cargando catálogos...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Aplicar Vacuna</h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Al guardar, el sistema destruirá la memoria de Redis para forzar una actualización.
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
            <select
              value={mascotaId}
              onChange={(e) => setMascotaId(e.target.value)}
              className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">-- Selecciona Paciente --</option>
              {listaMascotas.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre} ({m.especie})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vacuna Aplicada</label>
            <select
              value={vacunaId}
              onChange={handleCambioVacuna}
              className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">-- Selecciona Vacuna --</option>
              {listaVacunas.map((v) => (
                <option key={v.id} value={v.id}>{v.nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo ($)</label>
          <input
            type="number" step="0.01" min="0" value={costo} readOnly
            className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50 text-gray-700 font-bold outline-none cursor-not-allowed"
            placeholder="Se autocompleta con la BD"
          />
        </div>

        <button
          type="submit" disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-400 mt-2"
        >
          {cargando ? 'Registrando...' : 'Registrar Aplicación'}
        </button>
      </form>
    </div>
  );
}