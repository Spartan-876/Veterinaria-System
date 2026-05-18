package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.UsuarioDTO;
import com.utp.veterinaria.DTO.UsuarioRequestDTO;
import com.utp.veterinaria.Service.GUsuarios.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public List<UsuarioDTO> listarTodos() {
        return usuarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<UsuarioDTO> buscarPorCorreo(@PathVariable String correo) {
        return ResponseEntity.ok(usuarioService.buscarPorCorreo(correo));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.ok(usuarioService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable Long id, @RequestBody UsuarioRequestDTO dto) {
        return ResponseEntity.ok(usuarioService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/roles")
    public ResponseEntity<UsuarioDTO> asignarRoles(@PathVariable Long id, @RequestBody List<String> roles) {
        return ResponseEntity.ok(usuarioService.asignarRoles(id, roles));
    }
}