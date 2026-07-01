package com.utp.veterinaria.Model.GestionMedica;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Entity
@Table(name = "vacunas")
public class VacunaCatalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El fabricante es obligatorio")
    @Size(min = 2, max = 100, message = "El fabricante debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String fabricante;

    @NotBlank(message = "La enfermedad asociada es obligatoria")
    @Size(min = 2, max = 100, message = "La enfermedad asociada debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String enfermedadAsociada;

    @NotNull(message = "La edad recomendada es obligatoria")
    @Min(value = 0, message = "La edad recomendada debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Integer edadRecomendada;

    @NotNull(message = "La dosis es obligatoria")
    @Min(value = 0, message = "La dosis debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Integer dosis;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio debe ser mayor o igual a 0")
    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private boolean activo = true;
}
