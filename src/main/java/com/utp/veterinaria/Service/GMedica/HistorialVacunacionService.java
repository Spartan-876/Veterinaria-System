package com.utp.veterinaria.Service.GMedica;

import com.example.vet.Model.GestionMedica.HistorialVacunacion;
import com.example.vet.Repository.GMedica.HistorialVacunacionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialVacunacionService {

    private final HistorialVacunacionRepository historialVacunacionRepository;

    public List<HistorialVacunacion> listarTodos() {
        return historialVacunacionRepository.findAll();
    }

    public HistorialVacunacion guardar(HistorialVacunacion historial) {
        return historialVacunacionRepository.save(historial);
    }

    public List<HistorialVacunacion> buscarPorMascota(Long mascotaId) {
        return historialVacunacionRepository.findByMascotaId(mascotaId);
    }
}