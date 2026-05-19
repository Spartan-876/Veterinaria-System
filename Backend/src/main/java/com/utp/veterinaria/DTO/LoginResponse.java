package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String correo;
    private String rol;
    private List<String> roles;
    private List<String> modulos;
    private Long trabajadorId;
    private String nombre;
    private Long clienteId;
}