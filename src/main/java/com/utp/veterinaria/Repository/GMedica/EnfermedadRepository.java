package com.utp.veterinaria.Repository.GMedica;

import com.utp.veterinaria.Model.GestionMedica.Enfermedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnfermedadRepository extends JpaRepository<Enfermedad, Long> {
    List<Enfermedad> findAll();

    Optional<Enfermedad> findById(Long id);
}
