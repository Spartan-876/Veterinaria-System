package com.utp.veterinaria.DTO;


import lombok.Data;

import java.util.List;

@Data
public class EnfermedadRequestDTO {
    private String nombre;
    private String descripcion;
    private String gravedad;
    private List<Long> especiesIds;
}
