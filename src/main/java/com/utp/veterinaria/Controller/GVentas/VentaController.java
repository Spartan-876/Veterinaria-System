package com.utp.veterinaria.Controller.GVentas;

import com.utp.veterinaria.DTO.VentaRequestDTO;
import com.utp.veterinaria.Model.GestionVentas.Venta;
import com.utp.veterinaria.Service.GVentas.VentaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@RequiredArgsConstructor
public class VentaController {

    private final VentaService ventaService;

    @PostMapping
    public ResponseEntity<Venta> realizarVenta(@RequestBody VentaRequestDTO dto) {
        return ResponseEntity.ok(ventaService.realizarVentaDTO(dto));
    }

    @GetMapping
    public List<Venta> listarTodas() {
        return ventaService.listarVentas();
    }

    @GetMapping("/cliente/{clienteId}")
    public List<Venta> porCliente(@PathVariable Long clienteId) {
        return ventaService.listarPorCliente(clienteId);
    }
}