package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
    private Long id;
    private String correo;
    private String estado;
    private Long clienteId;
    private Long trabajadorId;
    private String nombreCliente;
    private String nombreTrabajador;
    private List<String> roles;
}