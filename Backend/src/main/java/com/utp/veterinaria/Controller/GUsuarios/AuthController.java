package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.LoginRequest;
import com.utp.veterinaria.DTO.LoginResponse;
import com.utp.veterinaria.DTO.RegistroClienteDTO;
import com.utp.veterinaria.Service.GUsuarios.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/registro/cliente")
    public ResponseEntity<?> registrarCliente(@Valid @RequestBody RegistroClienteDTO dto) {
        authService.registrarCliente(dto);
        return ResponseEntity.ok("Cliente registrado correctamente");
    }
}