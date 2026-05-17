package com.utp.veterinaria.Repository.GVentas;

import com.utp.veterinaria.Model.GestionVentas.Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicioRepository extends JpaRepository <Servicio,Long> {
}
