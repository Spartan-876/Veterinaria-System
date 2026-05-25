package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ModuloDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String nombreMostrar;
    private String ruta;
    private String icono;
    private Integer orden;
    private String grupo;
}