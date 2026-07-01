package com.utp.veterinaria.Controller.GMedica;

import com.utp.veterinaria.DTO.EnfermedadDTO;
import com.utp.veterinaria.DTO.EnfermedadRequestDTO;
import com.utp.veterinaria.Model.GestionMedica.Enfermedad;
import com.utp.veterinaria.Service.GMedica.EnfermedadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enfermedades")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EnfermedadController {

    private final EnfermedadService enfermedadService;

    @GetMapping
    public List<Enfermedad> listar() {
        return enfermedadService.listarTodas();
    }

    @PostMapping
    public ResponseEntity<EnfermedadDTO> crearEnfermedad(@RequestBody @Valid EnfermedadRequestDTO request){
        return ResponseEntity.ok(enfermedadService.crear(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enfermedad> obtenerPorId(@PathVariable Long id) {
        Enfermedad enfermedad = enfermedadService.buscarPorId(id);
        return enfermedad != null ? ResponseEntity.ok(enfermedad) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        enfermedadService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnfermedadDTO> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid EnfermedadRequestDTO request) {
        return ResponseEntity.ok(enfermedadService.actualizar(id, request));
    }
}