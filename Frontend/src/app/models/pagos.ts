// models/pagos.ts
export interface ResumenMes {
  mes: string;
  citas: number;
  productos: number;
}

export interface PagosResumenDTO {
  ingresosTotales: number;
  ingresosCitas: number;
  ingresosProductos: number;
  ingresosMesActual: number;
  ingresosCitasMes: number;
  ingresosProductosMes: number;
  totalVentas: number;
  totalCitasRealizadas: number;
  citasPendientesCobro: number;
  porMes: ResumenMes[];
}
