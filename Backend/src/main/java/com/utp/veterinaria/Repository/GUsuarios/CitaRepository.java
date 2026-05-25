package com.utp.veterinaria.Repository.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita,Long> {
    List<Cita> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Cita> findByMascotaClienteId(Long clienteId);
    List<Cita> findByTrabajadorIdAndFechaHoraBetween(Long trabajadorId, LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT COUNT(c) FROM Cita c WHERE c.fechaHora BETWEEN :inicio AND :fin")
    long countCitasHoy(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COUNT(c) FROM Cita c JOIN c.servicio s " +
           "WHERE c.fechaHora BETWEEN :inicio AND :fin AND s.precio > 0")
    long countCitasFacturables(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(s.precio), 0) FROM Cita c JOIN c.servicio s " +
           "WHERE c.fechaHora BETWEEN :inicio AND :fin AND c.estado = 'REALIZADA'")
    double sumVentasMes(@Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COUNT(c) FROM Cita c WHERE c.estado <> 'CANCELADA'")
    long countCitasProgramadas();

    @Query("SELECT COUNT(c) FROM Cita c WHERE c.trabajador.id = :trabajadorId AND c.fechaHora BETWEEN :inicio AND :fin")
    long countCitasHoyTrabajador(@Param("trabajadorId") Long trabajadorId, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(s.precio), 0) FROM Cita c JOIN c.servicio s " +
           "WHERE c.trabajador.id = :trabajadorId AND c.fechaHora BETWEEN :inicio AND :fin AND c.estado = 'REALIZADA'")
    double sumVentasMesTrabajador(@Param("trabajadorId") Long trabajadorId, @Param("inicio") LocalDateTime inicio, @Param("fin") LocalDateTime fin);
}
