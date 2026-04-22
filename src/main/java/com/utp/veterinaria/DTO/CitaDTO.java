package com.utp.veterinaria.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CitaDTO {
    private Long id;
    private LocalDateTime fechaHora;
    private String motivo;
    private String estado;

    // Servicio ← agregar servicioId
    private Long servicioId;
    private String servicioNombre;
    private Double precioServicio; // renombrar de precioAcordado

    // Mascota
    private Long mascotaId;
    private String mascotaNombre;

    // Cliente
    private Long clienteId;
    private String clienteNombre;

    // Trabajador
    private Long trabajadorId;
    private String trabajadorNombre;
}