package com.utp.veterinaria.Repository.GVentas;

import com.utp.veterinaria.Model.GestionVentas.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta,Long> {
    List<Venta> findByClienteId(Long clienteId);
}
