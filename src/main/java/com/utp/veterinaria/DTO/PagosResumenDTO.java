package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
public class PagosResumenDTO {
    // Totales generales
    private Double ingresosTotales;
    private Double ingresosCitas;
    private Double ingresosProductos;

    // Mes actual
    private Double ingresosMesActual;
    private Double ingresosCitasMes;
    private Double ingresosProductosMes;

    // Conteos
    private Long totalVentas;
    private Long totalCitasRealizadas;
    private Long citasPendientesCobro; // PENDIENTE + CONFIRMADA

    // Por mes (últimos 6 meses para gráfico)
    private List<ResumenMes> porMes;

    @Data
    @AllArgsConstructor
    public static class ResumenMes {
        private String mes;      // "Ene", "Feb"...
        private Double citas;
        private Double productos;
    }
}