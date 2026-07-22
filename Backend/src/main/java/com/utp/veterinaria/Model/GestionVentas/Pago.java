package com.utp.veterinaria.Model.GestionVentas;

import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pagos_registro")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "venta_id")
    @JsonIgnoreProperties({"detalles", "cliente.ventas", "cliente.usuario", "cliente.mascotas"})
    private Venta venta;

    @ManyToOne
    @JoinColumn(name = "cita_id")
    @JsonIgnoreProperties({"mascota.cliente", "trabajador"})
    private Cita cita;

    @Column(nullable = false)
    private Double monto;

    @Column(nullable = false)
    private String metodoPago;

    private String comentario;

    @Column(updatable = false)
    private LocalDateTime fechaPago;

    @PrePersist
    protected void onCreate() {
        this.fechaPago = LocalDateTime.now();
    }
}
