package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.Config.JwtUtil;
import com.utp.veterinaria.DTO.CitaDTO;
import com.utp.veterinaria.DTO.CitaRequestDTO;
import com.utp.veterinaria.DTO.DashboardDTO;
import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Repository.GMedica.MascotaRepository;
import com.utp.veterinaria.Service.GUsuarios.CitaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;
    private final MascotaRepository mascotaRepository;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<CitaDTO>> listarCitas() {
        return ResponseEntity.ok(citaService.listarCitas());
    }

    @PostMapping
    public ResponseEntity<CitaDTO> crearCita(@RequestBody @Valid CitaRequestDTO request) {
        return ResponseEntity.ok(citaService.crearCita(request));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDTO> getDashboard(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        List<String> modulos = jwtUtil.getModulosFromToken(token);
        Long trabajadorId = jwtUtil.getTrabajadorIdFromToken(token);
        return ResponseEntity.ok(citaService.getDashboard(modulos, trabajadorId));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<CitaDTO>> porCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(citaService.listarPorCliente(clienteId));
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

    @GetMapping("/mascota/{mascotaId}")
    public ResponseEntity<List<CitaDTO>> porMascota(@PathVariable Long mascotaId) {
        return ResponseEntity.ok(citaService.listarPorMascota(mascotaId));
    }

    @GetMapping("/mascotas/cliente/{clienteId}")
    public ResponseEntity<List<Mascota>> mascotasPorCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(mascotaRepository.findByClienteId(clienteId));
    }

    // ===== NUEVOS ENDPOINTS PARA PAGOS =====

    @PostMapping("/{id}/pagar")
    public ResponseEntity<CitaDTO> pagarCitaAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String metodoPago = body.get("metodoPago");
        if (metodoPago == null || metodoPago.isBlank()) {
            throw new RuntimeException("Método de pago requerido");
        }
        CitaDTO cita = citaService.registrarPagoCita(id, null, metodoPago);
        return ResponseEntity.ok(cita);
    }

    @PostMapping("/{id}/pagar-cliente")
    public ResponseEntity<CitaDTO> pagarCitaCliente(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        String metodoPago = (String) body.get("metodoPago");
        if (metodoPago == null || metodoPago.isBlank()) {
            throw new RuntimeException("Método de pago requerido");
        }
        Double monto = body.get("monto") != null ? Double.valueOf(body.get("monto").toString()) : null;
        CitaDTO cita = citaService.registrarPagoCita(id, monto, metodoPago);
        return ResponseEntity.ok(cita);
    }

    @GetMapping("/{id}/boleta")
    public ResponseEntity<CitaDTO> getBoletaCita(@PathVariable Long id) {
        // Retorna la cita con datos de pago para generar PDF en frontend
        List<CitaDTO> citas = citaService.listarCitas();
        CitaDTO cita = citas.stream().filter(c -> c.getId().equals(id)).findFirst()
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        return ResponseEntity.ok(cita);
    }

    @PostMapping("/cancelar-vencidas")
    public ResponseEntity<Map<String, Object>> cancelarVencidasManual() {
        citaService.cancelarCitasVencidas();
        return ResponseEntity.ok(Map.of("mensaje", "Citas vencidas canceladas correctamente"));
    }
}