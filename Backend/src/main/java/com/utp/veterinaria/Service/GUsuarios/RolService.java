package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.RolDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Rol;
import com.utp.veterinaria.Repository.GUsuarios.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;

    public List<RolDTO> listarTodos() {
        return rolRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RolDTO obtenerPorId(Long id) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + id));
        return toDTO(rol);
    }

    public RolDTO crear(RolDTO dto) {
        if (rolRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new RuntimeException("El rol ya existe: " + dto.getNombre());
        }
        Rol rol = new Rol();
        rol.setNombre(dto.getNombre());
        rol = rolRepository.save(rol);
        return toDTO(rol);
    }

    public RolDTO actualizar(Long id, RolDTO dto) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + id));
        
        rol.setNombre(dto.getNombre());
        rol = rolRepository.save(rol);
        return toDTO(rol);
    }

    public void eliminar(Long id) {
        if (!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado: " + id);
        }
        rolRepository.deleteById(id);
    }

    private RolDTO toDTO(Rol rol) {
        return new RolDTO(rol.getId(), rol.getNombre());
    }
}