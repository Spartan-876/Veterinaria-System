package com.utp.veterinaria.DTO;

import lombok.Data;

import java.util.List;

@Data
public class DashboardDTO {
    private long citasHoy;
    private long clientesActivos;
    private long totalMascotas;
    private double ventasMes;
    private List<CitaDTO> citasDeHoy;
    private long totalMedicos;
    private long totalCitasProgramadas;
}
