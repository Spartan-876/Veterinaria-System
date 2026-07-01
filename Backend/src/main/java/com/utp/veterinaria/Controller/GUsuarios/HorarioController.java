package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.Horario;
import com.utp.veterinaria.Service.GUsuarios.HorarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
public class HorarioController {

    private final HorarioService horarioService;

    @GetMapping("/trabajador/{id}")
    public List<Horario> porTrabajador(@PathVariable Long id) {
        return horarioService.buscarPorTrabajador(id);
    }

    @PostMapping
    public Horario asignar(@RequestBody @Valid Horario horario) {
        return horarioService.guardar(horario);
    }

    @PutMapping("/{id}")
    public Horario actualizar(@PathVariable Long id, @RequestBody @Valid Horario horario) {
        horario.setId(id);
        return horarioService.guardar(horario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        horarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}