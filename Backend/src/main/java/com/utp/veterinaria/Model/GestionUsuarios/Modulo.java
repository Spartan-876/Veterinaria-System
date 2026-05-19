package com.utp.veterinaria.Model.GestionUsuarios;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "modulos")
public class Modulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String nombre;

    @Column(length = 100)
    private String descripcion;
}