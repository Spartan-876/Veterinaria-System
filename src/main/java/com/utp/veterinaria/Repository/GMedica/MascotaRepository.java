package com.utp.veterinaria.Repository.GMedica;

import com.utp.veterinaria.Model.GestionMedica.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota,Long> {
    List<Mascota> findByClienteId(Long clienteId);

}
