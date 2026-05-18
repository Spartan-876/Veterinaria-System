// models/carrito.ts
export interface ItemCarrito {
  productoId: number;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
  imagenUrl?: string;
}

export interface VentaRequestDTO {
  clienteId: number;
  detalles: {
    productoId: number;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
  }[];
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA';
  cliente?: {
    id: number;
    nombres: string;
    apellidos: string;
    correo?: string;
  };
  detalles: {
    id: number;
    nombreProducto: string;
    precioUnitario: number;
    cantidad: number;
    subtotal: number;
  }[];
}
