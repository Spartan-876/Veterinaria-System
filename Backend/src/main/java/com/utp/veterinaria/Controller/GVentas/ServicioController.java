package com.utp.veterinaria.Controller.GVentas;

import com.utp.veterinaria.DTO.ServicioRequestDTO;
import com.utp.veterinaria.Model.GestionVentas.Servicio;
import com.utp.veterinaria.Service.GVentas.ServicioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ServicioController {

    private final ServicioService servicioService;

    @GetMapping("/activos")
    public List<Servicio> listarActivos() {
        return servicioService.listarActivos();
    }

    @GetMapping
    public List<Servicio> listar() {
        return servicioService.listar();
    }

    @PostMapping
    public ResponseEntity<Servicio> crear(@RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.ok(servicioService.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Long id, @RequestBody ServicioRequestDTO dto) {
        return ResponseEntity.ok(servicioService.actualizar(id, dto));
    }

}