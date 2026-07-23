package com.utp.veterinaria.Controller.GVentas;

import com.utp.veterinaria.DTO.PagosResumenDTO;
import com.utp.veterinaria.DTO.PagoRequestDTO;
import com.utp.veterinaria.Model.GestionVentas.Pago;
import com.utp.veterinaria.Model.GestionVentas.Venta;
import com.utp.veterinaria.Service.GVentas.PagosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagosController {

    private final PagosService pagosService;

    @GetMapping("/resumen")
    public ResponseEntity<PagosResumenDTO> getResumen() {
        return ResponseEntity.ok(pagosService.getResumen());
    }

    @PostMapping
    public ResponseEntity<Venta> registrarPago(@RequestBody PagoRequestDTO dto) {
        return ResponseEntity.ok(pagosService.registrarPago(dto));
    }

    @GetMapping("/venta/{ventaId}")
    public ResponseEntity<List<Pago>> listarPorVenta(@PathVariable Long ventaId) {
        return ResponseEntity.ok(pagosService.listarPorVenta(ventaId));
    }

    @GetMapping("/cita/{citaId}")
    public ResponseEntity<List<Pago>> listarPorCita(@PathVariable Long citaId) {
        return ResponseEntity.ok(pagosService.listarPorCita(citaId));
    }
}