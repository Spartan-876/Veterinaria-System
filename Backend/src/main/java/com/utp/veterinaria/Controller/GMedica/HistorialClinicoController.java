package com.utp.veterinaria.Controller.GMedica;

import com.utp.veterinaria.Model.GestionMedica.HistorialClinico;
import com.utp.veterinaria.Service.GMedica.HistorialClinicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-clinico")
@RequiredArgsConstructor
public class HistorialClinicoController {

    private final HistorialClinicoService service;

    @PostMapping
    public ResponseEntity<HistorialClinico> registrar(@RequestBody @Valid HistorialClinico historial) {
        return ResponseEntity.ok(service.guardar(historial));
    }

    // Endpoint para ver el historial de UNA mascota específica
    @GetMapping("/mascota/{mascotaId}")
    public List<HistorialClinico> listarPorMascota(@PathVariable Long mascotaId) {
        return service.buscarPorMascota(mascotaId);
    }
}