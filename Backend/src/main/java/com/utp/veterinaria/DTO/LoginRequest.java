package com.utp.veterinaria.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String correo;
    private String password;
}
