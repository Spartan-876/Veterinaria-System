package com.utp.veterinaria.Repository.GUsuarios;

import com.utp.veterinaria.Model.GestionUsuarios.Horario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioRepository extends JpaRepository<Horario,Long> {
    List<Horario> findByTrabajadorId(Long trabajadorId);
}
