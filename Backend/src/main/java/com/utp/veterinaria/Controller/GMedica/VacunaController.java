package com.utp.veterinaria.Controller.GMedica;

import com.utp.veterinaria.Model.GestionMedica.HistorialVacunacion;
import com.utp.veterinaria.Model.GestionMedica.VacunaCatalogo;
import com.utp.veterinaria.Service.GMedica.HistorialVacunacionService;
import com.utp.veterinaria.Service.GMedica.VacunaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacunas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VacunaController {

    private final VacunaService vacunaService;

    private final HistorialVacunacionService historialVacunacionService;

    // Catálogo de vacunas
    @GetMapping("/catalogo")
    public List<VacunaCatalogo> listarCatalogo() {
        return vacunaService.listarTodas();
    }

    @DeleteMapping("/{id}")
    public void eliminarVacuna(@PathVariable Long id) {
        vacunaService.eliminar(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VacunaCatalogo> actualizar(@PathVariable Long id, @RequestBody VacunaCatalogo vacuna) {
        return ResponseEntity.ok(vacunaService.actualizar(id, vacuna));
    }

    @PostMapping("/guardar")
    public VacunaCatalogo guardarVacuna(@RequestBody VacunaCatalogo vacuna) {
        return vacunaService.guardar(vacuna);
    }

    // Registrar aplicación de vacuna
    @PostMapping("/aplicar")
    public HistorialVacunacion aplicarVacuna(@RequestBody HistorialVacunacion historial) {
        return historialVacunacionService.guardar(historial);
    }

    // Ver vacunas de una mascota
    @GetMapping("/mascota/{mascotaId}")
    public List<HistorialVacunacion> verVacunasMascota(@PathVariable Long mascotaId) {
        return historialVacunacionService.buscarPorMascota(mascotaId);
    }

}