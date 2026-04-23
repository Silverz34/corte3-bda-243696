'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [selectedRol, setSelectedRol] = useState('');
  const [inputVetId, setInputVetId] = useState('');
  const [error, setError] = useState('');
  
  const { setAuth } = useAuth(); 
  const router = useRouter();    

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setError('');

    if (!selectedRol) {
      setError('Por favor, selecciona un rol para ingresar.');
      return;
    }

    if (selectedRol === 'veterinario' && !inputVetId) {
      setError('Los veterinarios deben ingresar su ID (ej. 1 o 2).');
      return;
    }
    const finalId = selectedRol === 'veterinario' ? inputVetId : '';
    setAuth(selectedRol, finalId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Clínica Veterinaria</h1>
          <p className="text-sm text-gray-500 mt-2">Simulador de Acceso</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Rol
            </label>
            <select
              value={selectedRol}
              onChange={(e) => setSelectedRol(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Elige un rol --</option>
              <option value="veterinario">Veterinario</option>
              <option value="recepcion">Recepción</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {selectedRol === 'veterinario' && (
            <div className="animate-fade-in-down">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID del Veterinario
              </label>
              <input
                type="number"
                min="1"
                placeholder="Ej: 1 (Dr. López)"
                value={inputVetId}
                onChange={(e) => setInputVetId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Entrar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
}