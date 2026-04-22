package com.utp.veterinaria.Repository.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.TrabajadorServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrabajadorServicioRepository extends JpaRepository<TrabajadorServicio, Long> {
    List<TrabajadorServicio> findByServicioId(Long servicioId);

    List<TrabajadorServicio> findByTrabajadorId(Long trabajadorId);

    boolean existsByTrabajadorIdAndServicioId(Long trabajadorId, Long servicioId);


}
