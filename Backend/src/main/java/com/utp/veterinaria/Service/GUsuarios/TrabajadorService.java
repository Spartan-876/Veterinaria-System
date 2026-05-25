package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.TrabajadorRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrabajadorService {

    private static final Logger logger = LoggerFactory.getLogger(TrabajadorService.class);

    private final TrabajadorRepository trabajadorRepository;

    public List<Trabajador> listarActivos() {
        logger.info("TRABAJADORES ACTIVOS LISTADOS");
        return trabajadorRepository.findAll().stream()
                .filter(trabajador -> trabajador.getEstado() == Trabajador.estadoTrabajador.ACTIVO)
                .toList();
    }

    public List<Trabajador> listarTodos() {
        logger.info("TRABAJADORES LISTADOS - TODOS");
        return trabajadorRepository.findAll();
    }

    public Trabajador crear(TrabajadorRequestDTO dto) {
        Trabajador t = new Trabajador();
        t.setDni(dto.getDni());
        t.setNombres(dto.getNombres());
        t.setApellidos(dto.getApellidos());
        t.setCargo(Trabajador.cargoTrabajador.valueOf(dto.getCargo()));
        t.setTelefono(dto.getTelefono());
        t.setCorreo(dto.getCorreo());
        t.setEstado(Trabajador.estadoTrabajador.valueOf(dto.getEstado()));
        return trabajadorRepository.save(t);
    }

    public Trabajador actualizar(Long id, TrabajadorRequestDTO dto) {
        Trabajador t = trabajadorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado: " + id));

        if (dto.getNombres() != null)   t.setNombres(dto.getNombres());
        if (dto.getApellidos() != null) t.setApellidos(dto.getApellidos());
        if (dto.getCargo() != null)     t.setCargo(Trabajador.cargoTrabajador.valueOf(dto.getCargo()));
        if (dto.getTelefono() != null)  t.setTelefono(dto.getTelefono());
        if (dto.getCorreo() != null)    t.setCorreo(dto.getCorreo());
        if (dto.getEstado() != null)    t.setEstado(Trabajador.estadoTrabajador.valueOf(dto.getEstado()));

        return trabajadorRepository.save(t);
    }
}