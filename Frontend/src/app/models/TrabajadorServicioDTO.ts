export interface TrabajadorServicioDTO {
  id: number;
  trabajador: {
    id: number;
    nombres: string;
    apellidos: string;
    cargo: string;
    estado: string;
  };
}
