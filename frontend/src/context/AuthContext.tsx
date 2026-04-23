'use client';

import { createContext, useContext, useState, ReactNode} from 'react';

interface AuthContextType {
  rol: string;
  vetId: string;
  setAuth: (rol: string, id: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

//Creamos el contexto vacío
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// El Proveedor (Provider) que envolverá la App
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [rol, setRol] = useState<string>('');
  const [vetId, setVetId] = useState<string>('');

  // Persistencia simple: Al cargar la página, revisamos si había algo en memoria
  const setAuth = (nuevoRol: string, nuevoId: string) => {
    setRol(nuevoRol);
    setVetId(nuevoId);
  };

  const logout = () => {
    setRol('');
    setVetId('');
  };

  const isAuthenticated = rol !== '';

  return (
    <AuthContext.Provider value={{ rol, vetId, setAuth, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

//Hook personalizado para usarlo fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};