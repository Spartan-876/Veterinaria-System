package com.utp.veterinaria.DTO;

import lombok.Data;

@Data
public class TrabajadorRequestDTO {
    private String nombres;
    private String apellidos;
    private String cargo;
    private String estado;
    private String correo;
    private String dni;
    private String telefono;
}
