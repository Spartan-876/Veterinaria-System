package com.utp.veterinaria.Controller.GVentas;

import com.utp.veterinaria.DTO.PagosResumenDTO;
import com.utp.veterinaria.Service.GVentas.PagosService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
public class PagosController {

    private final PagosService pagosService;

    @GetMapping("/resumen")
    public ResponseEntity<PagosResumenDTO> getResumen() {
        return ResponseEntity.ok(pagosService.getResumen());
    }
}