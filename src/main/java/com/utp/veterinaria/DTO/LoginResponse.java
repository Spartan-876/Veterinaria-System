package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String correo;
    private String rol;
    private Long trabajadorId;
    private String nombre;
    private Long clienteId;
}