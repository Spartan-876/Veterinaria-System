package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.Usuario;
import com.utp.veterinaria.Service.GUsuarios.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrar(usuario);
    }

    @GetMapping("/{correo}")
    public Usuario buscar(@PathVariable String correo) {
        return usuarioService.buscarPorCorreo(correo);
    }
}