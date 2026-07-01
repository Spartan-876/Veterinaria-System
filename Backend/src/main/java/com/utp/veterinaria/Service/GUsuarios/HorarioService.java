package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.Horario;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Repository.GUsuarios.HorarioRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioRepository horarioRepository;
    private final TrabajadorRepository trabajadorRepository;

    public List<Horario> buscarPorTrabajador(Long trabajadorId) {
        return horarioRepository.findByTrabajadorId(trabajadorId).stream()
                .filter(Horario::isActivo)
                .toList();
    }

    public Horario guardar(Horario horario) {
        // Verificar que el trabajador existe
        trabajadorRepository.findById(horario.getTrabajadorId())
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        // Validar que horaFin sea despues de horaInicio
        if (horario.getHoraFin().isBefore(horario.getHoraInicio())
                || horario.getHoraFin().equals(horario.getHoraInicio())) {
            throw new RuntimeException("La hora de fin debe ser posterior a la hora de inicio");
        }

        // Detectar solapamiento de horarios para el mismo trabajador en el mismo dia
        List<Horario> existentes = horarioRepository.findByTrabajadorId(horario.getTrabajadorId());
        boolean solapado = existentes.stream()
                .filter(h -> h.isActivo())
                .filter(h -> h.getDiaSemana() == horario.getDiaSemana())
                .filter(h -> h.getId() == null || !h.getId().equals(horario.getId()))
                .anyMatch(h -> horario.getHoraInicio().isBefore(h.getHoraFin())
                        && horario.getHoraFin().isAfter(h.getHoraInicio()));

        if (solapado) {
            throw new RuntimeException("El horario se solapa con otro horario existente para el mismo dia");
        }

        return horarioRepository.save(horario);
    }

    public void eliminar(Long id) {
        Horario horario = horarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));
        horario.setActivo(false);
        horarioRepository.save(horario);
    }
}