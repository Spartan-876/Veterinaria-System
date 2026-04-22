package com.utp.veterinaria.Model.GestionMedica;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="historial_vacunacion")
public class HistorialVacunacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    private Long trabajadorId;

    private String nombreVacuna;
    private LocalDateTime fechaAplicacion;
    private String lote;
    private String reacciones;
    private String observaciones;

    @Column(name = "documento_clinico", columnDefinition = "JSON")
    private String documentoClinicoJson;
}