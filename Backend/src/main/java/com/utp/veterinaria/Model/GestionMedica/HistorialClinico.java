package com.utp.veterinaria.Model.GestionMedica;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name="historial_clinico")
public class HistorialClinico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La mascota es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mascota_id", nullable = false)
    private Mascota mascota;

    private Long citaId;

    @Column(name = "fecha_registro", updatable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        fechaRegistro = LocalDateTime.now();
    }

    private String enfermedadDetectada;
    private String vacunaAplicada;
    private String diagnostico;
    @Column(columnDefinition = "TEXT")
    private String tratamiento;
    private Double peso;

    @Column(nullable = false)
    private boolean activo = true;
}
