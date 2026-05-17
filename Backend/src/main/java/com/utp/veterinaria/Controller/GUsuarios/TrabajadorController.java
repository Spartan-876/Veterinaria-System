package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.TrabajadorRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Service.GUsuarios.TrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trabajadores")
@RequiredArgsConstructor
public class TrabajadorController {

    private final TrabajadorService trabajadorService;

    @GetMapping
    public List<Trabajador> listar() {
        return trabajadorService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Trabajador> crear(@RequestBody TrabajadorRequestDTO dto) {
        Trabajador nuevo = trabajadorService.crear(dto);
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trabajador> actualizar(@PathVariable Long id, @RequestBody TrabajadorRequestDTO dto) {
        Trabajador actualizado = trabajadorService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }
}