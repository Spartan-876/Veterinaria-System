package com.utp.veterinaria.Model.GestionUsuarios;

import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El DNI es obligatorio")
    @Pattern(regexp = "^\\d{8}$", message = "El DNI debe tener 8 digitos")
    @Column(unique = true, nullable = false)
    private String dni;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellidos;

    @NotBlank(message = "La direccion es obligatoria")
    private String direccion;

    @NotBlank(message = "El telefono es obligatorio")
    @Pattern(regexp = "^\\d{9}$", message = "El telefono debe tener 9 digitos")
    private String telefono;

    @Column(unique = true)
    @Email(message = "El correo debe ser valido")
    private String correo;

    @ToString.Exclude
    @OneToOne(mappedBy = "cliente")
    @JsonIgnore
    private Usuario usuario;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    @JsonIgnore
    @ToString.Exclude
    private List<Mascota> mascotas = new ArrayList<>();

}
