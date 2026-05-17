package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.TrabajadorServicioDTO;
import com.utp.veterinaria.Service.GUsuarios.TrabajadorServicioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trabajador-servicio")
@RequiredArgsConstructor
public class TrabajadorServicioController {

    private final TrabajadorServicioService trabajadorServicioService;

    // GET /api/trabajador-servicio/por-servicio/1
    @GetMapping("/por-servicio/{servicioId}")
    public ResponseEntity<List<TrabajadorServicioDTO>> obtenerPorServicio(
            @PathVariable Long servicioId) {
        return ResponseEntity.ok(
                trabajadorServicioService.obtenerTrabajadoresPorServicio(servicioId)
        );
    }
}
