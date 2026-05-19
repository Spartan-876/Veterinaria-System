package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.ModuloDTO;
import com.utp.veterinaria.Service.GUsuarios.ModuloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modulos")
@RequiredArgsConstructor
public class ModuloController {

    private final ModuloService moduloService;

    @GetMapping
    public List<ModuloDTO> listarTodos() {
        return moduloService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuloDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(moduloService.obtenerPorId(id));
    }
}