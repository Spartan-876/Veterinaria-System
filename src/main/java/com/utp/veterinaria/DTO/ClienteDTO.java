package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDTO {
    private Long id;
    private String dni;
    private String nombres;
    private String apellidos;
    private String direccion;
    private String telefono;
    private String correo;
    private int totalMascotas;
}
