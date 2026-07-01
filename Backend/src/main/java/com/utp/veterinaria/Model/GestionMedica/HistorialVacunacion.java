package com.utp.veterinaria.Model.GestionMedica;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="historial_vacunacion")
public class HistorialVacunacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La mascota es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    private Long trabajadorId;

    @NotBlank(message = "El nombre de la vacuna es obligatorio")
    private String nombreVacuna;
    private LocalDateTime fechaAplicacion;
    private String lote;
    private String reacciones;
    private String observaciones;

    @Column(name = "documento_clinico", columnDefinition = "JSON")
    private String documentoClinicoJson;
}