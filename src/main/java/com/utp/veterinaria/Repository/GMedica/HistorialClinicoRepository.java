package com.utp.veterinaria.Repository.GMedica;

import com.utp.veterinaria.Model.GestionMedica.HistorialClinico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialClinicoRepository extends JpaRepository<HistorialClinico,Long> {
    List<HistorialClinico> findByMascotaId(Long mascotaId);
}
