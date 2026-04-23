'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BusquedaMascotas from '@/components/BusquedaMascota';
import VacunasPendientes from '@/components/vacunaspendient';

export default function DashboardPage() {
  const { rol, vetId, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null; 

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
            <p className="text-sm text-gray-500">
              Sesión activa: <span className="font-semibold text-blue-600 uppercase">{rol}</span> 
              {vetId && ` (ID: ${vetId})`}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="px-8 mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {(rol === 'veterinario' || rol === 'admin') && (
            <>
              <BusquedaMascotas />
              {/* <AgendarCita /> */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-100 placeholder-card">
                <h2 className="text-lg font-bold mb-2 text-black"> Agendar Cita</h2>
                <p className="text-sm text-gray-500">Aquí irá el componente que ejecuta el Stored Procedure.</p>
              </div>

              {/* <AplicarVacuna /> */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-100 placeholder-card">
                <h2 className="text-lg font-bold mb-2 text-black"> Aplicar Vacuna</h2>
                <p className="text-sm text-gray-500">Aquí irá el componente que inserta y borra el caché de Redis.</p>
              </div>
            </>
          )}


          {(rol === 'recepcion' || rol === 'admin') && (
            <>
               {rol === 'recepcion' && (
                 <>
                    <BusquedaMascotas/>

                  {/* <AgendarCita /> */}
                  <div className="bg-white p-6 rounded-xl shadow border-l-4">
                    <h2 className="text-lg font-bold mb-2 text-black"> Agendar Cita</h2>
                  </div>
                 </>
               )}
                <VacunasPendientes/>
            </>
          )}

        </div>
      </main>
    </div>
  );
}