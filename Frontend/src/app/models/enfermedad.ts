import { Especie } from "./especie";

export interface Enfermedad {
    id: number;
    nombre: string;
    gravedad: string;
    descripcion: string;
    especies: Especie[]
}