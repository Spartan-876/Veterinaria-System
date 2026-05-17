package com.utp.veterinaria.Model.GestionMedica;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "enfermedades")
public class Enfermedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 2, max = 255, message = "La descripción debe tener entre 2 y 255 caracteres")
    @Column(nullable = false, length = 255)
    private String descripcion;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonManagedReference
    @JoinTable(name = "especie_enfermedad", joinColumns = @JoinColumn(name = "enfermedad_id"), inverseJoinColumns = @JoinColumn(name = "especie_id"))
    private List<Especie> especies;

    @NotBlank(message = "La gravedad es obligatoria")
    @Size(min = 2, max = 100, message = "La gravedad debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String gravedad;
}
