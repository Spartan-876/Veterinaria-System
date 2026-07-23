package com.utp.veterinaria.DTO;

import lombok.Data;

import java.util.List;

@Data
public class VentaRequestDTO {
    private Long clienteId;
    private List<DetalleDTO> detalles;
    private String metodoPago;

    @Data
    public static class DetalleDTO {
        private Long productoId;
        private String nombreProducto;
        private Double precioUnitario;
        private Integer cantidad;
    }
}
