package com.utp.veterinaria.Service.GMedica;

import com.utp.veterinaria.Model.GestionMedica.HistorialClinico;
import com.utp.veterinaria.Repository.GMedica.HistorialClinicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialClinicoService {

    private final HistorialClinicoRepository historialClinicoRepository;

    public List<HistorialClinico> listarTodos() {
        return historialClinicoRepository.findAll().stream()
                .filter(HistorialClinico::isActivo)
                .toList();
    }

    public List<HistorialClinico> buscarPorMascota(Long mascotaId) {
        return historialClinicoRepository.findByMascotaId(mascotaId).stream()
                .filter(HistorialClinico::isActivo)
                .toList();
    }

    public HistorialClinico guardar(HistorialClinico historial) {
        return historialClinicoRepository.save(historial);
    }

    public void eliminar(Long id) {
        HistorialClinico historial = historialClinicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Historial clinico no encontrado"));
        historial.setActivo(false);
        historialClinicoRepository.save(historial);
    }
}