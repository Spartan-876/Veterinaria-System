package com.utp.veterinaria.Service.GUsuarios;

import com.example.vet.DTO.TrabajadorServicioDTO;
import com.example.vet.Model.GestionUsuarios.Trabajador;
import com.example.vet.Model.GestionUsuarios.TrabajadorServicio;
import com.example.vet.Repository.GUsuarios.TrabajadorServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrabajadorServicioService {

    private final TrabajadorServicioRepository trabajadorServicioRepository;

    // Trae trabajadores ACTIVOS que ofrecen un servicio específico
    public List<TrabajadorServicioDTO> obtenerTrabajadoresPorServicio(Long servicioId) {
        return trabajadorServicioRepository.findByServicioId(servicioId)
                .stream()
                .filter(ts -> ts.getTrabajador().getEstado() == Trabajador.estadoTrabajador.ACTIVO)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private TrabajadorServicioDTO toDTO(TrabajadorServicio ts) {
        TrabajadorServicioDTO dto = new TrabajadorServicioDTO();
        Trabajador t = ts.getTrabajador();
        dto.setTrabajadorId(t.getId());
        dto.setTrabajadorNombre(t.getNombres() + " " + t.getApellidos());
        dto.setCargo(t.getCargo().name());
        dto.setEstado(t.getEstado().name());
        return dto;
    }
}