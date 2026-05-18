export interface Usuario {
  id: number;
  correo: string;
  estado: string;
  clienteId: number | null;
  trabajadorId: number | null;
  nombreCliente: string | null;
  nombreTrabajador: string | null;
  roles: string[];
}

export interface UsuarioRequest {
  correo: string;
  password: string;
  estado: string;
  clienteId: number | null;
  trabajadorId: number | null;
  roles: string[];
}