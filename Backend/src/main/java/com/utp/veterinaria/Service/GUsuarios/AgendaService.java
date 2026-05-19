package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.AgendaDTO;
import com.utp.veterinaria.DTO.CitaDTO;
import com.utp.veterinaria.DTO.HorarioDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.utp.veterinaria.Model.GestionUsuarios.Horario;
import com.utp.veterinaria.Repository.GUsuarios.CitaRepository;
import com.utp.veterinaria.Repository.GUsuarios.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final CitaRepository citaRepository;
    private final HorarioRepository horarioRepository;

    public AgendaDTO getMiAgenda(Long trabajadorId) {
        LocalDateTime ahora = LocalDateTime.now();
        LocalDate hoy = ahora.toLocalDate();

        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime finHoy = hoy.atTime(LocalTime.MAX);

        LocalDateTime finSemana = ahora.plusDays(7);

        List<Cita> citasHoy = citaRepository
                .findByTrabajadorIdAndFechaHoraBetween(trabajadorId, inicioHoy, finHoy);

        List<Cita> citasSemana = citaRepository
                .findByTrabajadorIdAndFechaHoraBetween(trabajadorId, ahora, finSemana);

        List<Horario> horarios = horarioRepository.findByTrabajadorId(trabajadorId);

        DayOfWeek diaActual = hoy.getDayOfWeek();
        List<Horario> horarioHoy = horarios.stream()
                .filter(h -> h.getDiaSemana() == diaActual && h.isActivo())
                .collect(Collectors.toList());

        AgendaDTO dto = new AgendaDTO();
        dto.setCitasHoy(citasHoy.stream().map(this::toCitaDTO).collect(Collectors.toList()));
        dto.setCitasSemana(citasSemana.stream().map(this::toCitaDTO).collect(Collectors.toList()));
        dto.setHorarioHoy(horarioHoy.stream().map(this::toHorarioDTO).collect(Collectors.toList()));

        return dto;
    }

    private CitaDTO toCitaDTO(Cita cita) {
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        dto.setFechaHora(cita.getFechaHora());
        dto.setMotivo(cita.getMotivo());
        dto.setEstado(cita.getEstado().name());

        if (cita.getMascota() != null) {
            dto.setMascotaId(cita.getMascota().getId());
            dto.setMascotaNombre(cita.getMascota().getNombre());
        }

        if (cita.getServicio() != null) {
            dto.setServicioId(cita.getServicio().getId());
            dto.setServicioNombre(cita.getServicio().getNombre());
        }

        if (cita.getTrabajador() != null) {
            dto.setTrabajadorId(cita.getTrabajador().getId());
            dto.setTrabajadorNombre(cita.getTrabajador().getNombres());
        }

        if (cita.getMascota() != null && cita.getMascota().getCliente() != null) {
            dto.setClienteNombre(cita.getMascota().getCliente().getNombres());
        }

        return dto;
    }

    private HorarioDTO toHorarioDTO(Horario horario) {
        HorarioDTO dto = new HorarioDTO();
        dto.setId(horario.getId());
        dto.setTrabajadorId(horario.getTrabajadorId());
        dto.setDiaSemana(horario.getDiaSemana());
        dto.setHoraInicio(horario.getHoraInicio());
        dto.setHoraFin(horario.getHoraFin());
        dto.setActivo(horario.isActivo());
        return dto;
    }
}