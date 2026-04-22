package com.utp.veterinaria.Model.GestionVentas;

import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(updatable = false)
    private LocalDateTime fecha;

    @PrePersist
    protected void onCreate() {
        this.fecha = LocalDateTime.now();
    }

    private Double total;
    private String metodoPago;
    private String codigoOperacion;

    @Enumerated(EnumType.STRING)
    private Estadoventa estado;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    @JsonIgnoreProperties({"ventas", "usuario", "mascotas"})
    private Cliente cliente;

    @OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<DetalleVenta> detalles = new ArrayList<>();

    public enum Estadoventa{
        PENDIENTE, COMPLETADA, CANCELADA
    }
}
