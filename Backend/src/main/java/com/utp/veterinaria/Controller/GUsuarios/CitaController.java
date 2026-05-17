package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.CitaDTO;
import com.utp.veterinaria.DTO.CitaRequestDTO;
import com.utp.veterinaria.DTO.DashboardDTO;
import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Repository.GMedica.MascotaRepository;
import com.utp.veterinaria.Service.GUsuarios.CitaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;

    private final MascotaRepository mascotaRepository;

    @GetMapping
    public ResponseEntity<List<CitaDTO>> listarCitas() {
        return ResponseEntity.ok(citaService.listarCitas());
    }

    @PostMapping
    public ResponseEntity<CitaDTO> crearCita(@RequestBody @Valid CitaRequestDTO request) {
        return ResponseEntity.ok(citaService.crearCita(request));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard(){
        return ResponseEntity.ok(citaService.getDashboard());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<CitaDTO>> porCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(citaService.listarPorCliente(clienteId));
    }

    @PatchMapping("/{id}/cancelar")
    public ResponseEntity<CitaDTO> cancelar(@PathVariable Long id) {
        return ResponseEntity.ok(citaService.cancelarCita(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CitaDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        return ResponseEntity.ok(citaService.cambiarEstado(id, estado));
    }

    @GetMapping("/trabajadores-disponibles")
    public ResponseEntity<List<Trabajador>> disponibles(
            @RequestParam Long servicioId,
            @RequestParam String fechaHora) {
        LocalDateTime fecha = LocalDateTime.parse(fechaHora);
        return ResponseEntity.ok(citaService.trabajadoresDisponibles(servicioId, fecha));
    }

    @GetMapping("/mascotas/cliente/{clienteId}")
    public ResponseEntity<List<Mascota>> mascotasPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(mascotaRepository.findByClienteId(clienteId));
    }
}