export interface Mascota {
  id?: number;
  nombre: string;
  especie: 'Canina' | 'Felina';
  raza: string;
  sexo: 'Macho' | 'Hembra';
  edad: string;
  peso: number;
  observaciones?: string;
  cliente?: {
    id: number;
    nombres?: string;
    apellidos?: string;
    dni?: string;
  };
}
