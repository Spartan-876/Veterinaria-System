package com.utp.veterinaria.DTO;

import lombok.Data;

import java.util.List;

@Data
public class EnfermedadDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String gravedad;
    private List<EspecieDTO> especies; // lista de objetos, no solo IDs
}

