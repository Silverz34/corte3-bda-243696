'use client';

import { useState } from 'react';
import { useCitas } from '@/hook/useCitas';
import { useAuth } from '@/context/AuthContext';

export default function AgendarCita() {
  const { agendarCita, cargando, error, exito, setError } = useCitas();
  const { rol, vetId } = useAuth();

  const [mascotaId, setMascotaId] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [veterinarioId, setVeterinarioId] = useState(rol === 'veterinario' ? vetId : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mascotaId || !veterinarioId || !fechaHora || !motivo) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    const idNumero = parseInt(mascotaId, 10);
    const idVetNum = parseInt(veterinarioId, 10);
    const fueExitoso = await agendarCita(idNumero, idVetNum, fechaHora, motivo);
    

    if (fueExitoso) {
      setMascotaId('');
      setFechaHora('');
      setMotivo('');
      if (rol !== 'veterinario') setVeterinarioId(''); 
      }
    };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800"> Agendar Nueva Cita</h2>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
          <strong>Error BD:</strong> {error}
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
              className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej. 5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ID Veterinario</label>
            <input
              type="number" min="1" value={veterinarioId}
              onChange={(e) => setVeterinarioId(e.target.value)}
              disabled={rol === 'veterinario'} // Bloqueamos el campo si él mismo es el veterinario
              className={`w-full border border-gray-300 rounded-lg p-2 outline-none ${rol === 'veterinario' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'focus:ring-2 focus:ring-blue-500'}`}
              placeholder="Ej. 1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
          <input
            type="datetime-local" value={fechaHora}
            onChange={(e) => setFechaHora(e.target.value)}
            className="w-full border text-gray-500 border-gray-300 rounded-lg p-2 focus:ring-2
             focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de la Consulta</label>
          <textarea
            value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
            className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <button
          type="submit" disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-400 mt-2"
        >
          {cargando ? 'Procesando en BD...' : 'Confirmar Cita'}
        </button>
      </form>
    </div>
  );
}