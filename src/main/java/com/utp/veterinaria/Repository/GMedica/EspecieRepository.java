package com.utp.veterinaria.Repository.GMedica;

import com.utp.veterinaria.Model.GestionMedica.Especie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EspecieRepository extends JpaRepository<Especie, Long> {
}
