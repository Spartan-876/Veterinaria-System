package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.ModuloDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Modulo;
import com.utp.veterinaria.Repository.GUsuarios.ModuloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ModuloService {

    private final ModuloRepository moduloRepository;

    public List<ModuloDTO> listarTodos() {
        return moduloRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ModuloDTO obtenerPorId(Long id) {
        Modulo modulo = moduloRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Módulo no encontrado: " + id));
        return toDTO(modulo);
    }

    private ModuloDTO toDTO(Modulo modulo) {
        return new ModuloDTO(modulo.getId(), modulo.getNombre(), modulo.getDescripcion());
    }
}