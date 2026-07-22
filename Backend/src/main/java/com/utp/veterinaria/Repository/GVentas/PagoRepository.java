package com.utp.veterinaria.Repository.GVentas;

import com.utp.veterinaria.Model.GestionVentas.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    List<Pago> findByVentaId(Long ventaId);
    List<Pago> findByCitaId(Long citaId);
}
