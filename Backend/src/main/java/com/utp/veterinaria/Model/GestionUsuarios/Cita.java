package com.utp.veterinaria.Model.GestionUsuarios;

import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Model.GestionVentas.Servicio;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "citas")
public class Cita {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La fecha y hora son obligatorias")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime fechaHora;

    @NotBlank(message = "Ingrese un motivo")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String motivo;

    @Enumerated(EnumType.STRING)
    private EstadoCita estado;

    @ManyToOne
    @JoinColumn(name = "mascota_id",nullable = false)
    @JsonIgnoreProperties({"citas", "clientes"})
    private Mascota mascota;

    @ManyToOne
    @JoinColumn(name = "servicio_id")
    @JsonIgnoreProperties("trabajadores")
    private Servicio servicio;

    @ManyToOne
    @JoinColumn(name = "trabajador_id")
    @JsonIgnoreProperties({"usuario", "servicios", "citas"})
    private Trabajador trabajador;

    public enum EstadoCita{
        PENDIENTE, CONFIRMADA, REALIZADA, CANCELADA
    }
}
