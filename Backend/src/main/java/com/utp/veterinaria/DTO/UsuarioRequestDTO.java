package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequestDTO {
    private String correo;
    private String password;
    private String estado;
    private Long clienteId;
    private Long trabajadorId;
    private List<String> roles;
}