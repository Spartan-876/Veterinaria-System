package com.utp.veterinaria.Model.GestionUsuarios;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "trabajadores")
public class Trabajador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @Pattern(regexp = "^\\d{8}$", message = "El DNI debe tener 8 digitos")
    private String dni;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellidos;

    @Enumerated(EnumType.STRING)
    private cargoTrabajador cargo;

    @NotBlank(message = "El telefono es obligatorio")
    @Pattern(regexp = "^\\d{9}$", message = "El telefono debe tener 9 digitos")
    private String telefono;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe ser valido")
    private String correo;

    @Enumerated(EnumType.STRING)
    private estadoTrabajador estado;

    @ToString.Exclude
    @OneToOne(mappedBy = "trabajador", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("trabajador")
    private Usuario usuario;

    @ToString.Exclude
    @OneToMany(mappedBy = "trabajador", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnoreProperties("trabajador")
    private List<TrabajadorServicio> servicios = new ArrayList<>();

    // ENUMS PARA LA CLASE TRABAJADOR
    public enum cargoTrabajador {
        VETERINARIO, ESTILISTA, CIRUJANO, RECEPCIONISTA
    }

    public enum estadoTrabajador {
        ACTIVO, INACTIVO
    }
}
