package com.utp.veterinaria.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PagoRequestDTO {
    private Long ventaId;
    private Long citaId;
    private Double monto;
    private String metodoPago;
    private String comentario;

    @Data
    public static class PagoResponseDTO {
        private Long id;
        private Long ventaId;
        private Long citaId;
        private Double monto;
        private String metodoPago;
        private String comentario;
        private LocalDateTime fechaPago;
    }
}
