package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.RolDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Modulo;
import com.utp.veterinaria.Model.GestionUsuarios.Rol;
import com.utp.veterinaria.Repository.GUsuarios.ModuloRepository;
import com.utp.veterinaria.Repository.GUsuarios.RolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolService {

    private final RolRepository rolRepository;
    private final ModuloRepository moduloRepository;

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

    @Transactional
    public RolDTO crear(RolDTO dto) {
        if (rolRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new RuntimeException("El rol ya existe: " + dto.getNombre());
        }
        Rol rol = new Rol();
        rol.setNombre(dto.getNombre());
        
        if (dto.getModulos() != null && !dto.getModulos().isEmpty()) {
            Set<Modulo> modulos = new HashSet<>();
            for (String nombreModulo : dto.getModulos()) {
                moduloRepository.findByNombre(nombreModulo).ifPresent(modulos::add);
            }
            rol.setModulos(modulos);
        }
        
        rol = rolRepository.save(rol);
        return toDTO(rol);
    }

    @Transactional
    public RolDTO actualizar(Long id, RolDTO dto) {
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + id));
        
        rol.setNombre(dto.getNombre());
        
        if (dto.getModulos() != null) {
            Set<Modulo> modulos = new HashSet<>();
            if (!dto.getModulos().isEmpty()) {
                for (String nombreModulo : dto.getModulos()) {
                    moduloRepository.findByNombre(nombreModulo).ifPresent(modulos::add);
                }
            }
            rol.setModulos(modulos);
        }
        
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
        List<String> modulos = rol.getModulos().stream()
                .map(Modulo::getNombre)
                .collect(Collectors.toList());
        return new RolDTO(rol.getId(), rol.getNombre(), modulos);
    }
}