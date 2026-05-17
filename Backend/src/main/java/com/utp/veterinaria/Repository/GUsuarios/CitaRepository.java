package com.utp.veterinaria.Repository.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita,Long> {
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Cita> findByMascotaClienteId(Long clienteId);
    List<Cita> findByTrabajadorIdAndFechaHoraBetween(Long trabajadorId, LocalDateTime inicio, LocalDateTime fin);
}
