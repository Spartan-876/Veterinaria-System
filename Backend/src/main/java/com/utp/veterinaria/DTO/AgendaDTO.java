package com.utp.veterinaria.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgendaDTO {
    private List<CitaDTO> citasHoy;
    private List<CitaDTO> citasSemana;
    private List<HorarioDTO> horarioHoy;
}