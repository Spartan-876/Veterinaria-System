package com.utp.veterinaria.Model.GestionUsuarios;

import com.example.vet.Model.GestionVentas.Servicio;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "trabajador_servicio")
@Data
public class TrabajadorServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne
    @JoinColumn(name = "trabajador_id", nullable = false)
    @JsonIgnoreProperties("servicios")
    private Trabajador trabajador;

    @ManyToOne
    @JoinColumn(name = "servicio_id", nullable = false)
    @JsonIgnoreProperties("trabajadores")
    private Servicio servicio;
}
