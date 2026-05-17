package com.utp.veterinaria.Repository.GVentas;

import com.utp.veterinaria.Model.GestionVentas.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository extends JpaRepository<Producto,Long> {

}
