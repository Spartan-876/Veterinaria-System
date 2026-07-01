package com.utp.veterinaria.Model.GestionMedica;

import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

import java.util.List;

@Data
@Entity
@Table(name = "mascotas")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "La especie es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre de la especie debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String especie;

    @NotBlank(message = "La raza obligatoria")
    @Size(min = 2, max = 100, message = "El nombre de la raza debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String raza;

    @NotBlank(message = "El sexo es obligatorio")
    @Size(min = 2, max = 100, message = "El sexo debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 100)
    private String sexo;

    @NotBlank(message = "La edad es obligatorio")
    @Size(min = 2, max = 40, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, length = 40)
    private String edad;

    @NotNull(message = "La peso es obligatorio")
    @Min(value = 0, message = "La peso debe ser mayor o igual a 0")
    @Column(nullable = false)
    private double peso;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(nullable = false)
    private boolean activo = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", nullable = false)
    @JsonIgnoreProperties("mascotas")
    @ToString.Exclude
    private Cliente cliente;

    @OneToMany(mappedBy = "mascota", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    private List<HistorialClinico> historialesClinicos;

    @OneToMany(mappedBy = "mascota", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    private List<Cita> citas;
}
