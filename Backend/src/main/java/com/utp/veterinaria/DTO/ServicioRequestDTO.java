package com.utp.veterinaria.DTO;

import lombok.Data;

import java.util.List;

@Data
public class ServicioRequestDTO {
    private String nombre;
    private String descripcion;
    private String icono;
    private Double precio;
    private String estado;
    private List<Long> trabajadorIds;
}
