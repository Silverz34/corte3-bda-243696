

export interface MascotaCatalogo {
  id: number;
  nombre: string;
  especie: string;
}

export interface VacunaCatalogo {
  id: number;
  nombre: string;
  precio: number; // Vital para autocompletar
}

export interface VeterinarioCatalogo {
  id: number;
  nombre: string;
}