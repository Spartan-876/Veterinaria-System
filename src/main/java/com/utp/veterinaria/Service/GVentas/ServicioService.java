package com.utp.veterinaria.Service.GVentas;

import com.example.vet.DTO.ServicioRequestDTO;
import com.example.vet.Model.GestionUsuarios.Trabajador;
import com.example.vet.Model.GestionUsuarios.TrabajadorServicio;
import com.example.vet.Model.GestionVentas.Servicio;
import com.example.vet.Repository.GUsuarios.TrabajadorRepository;
import com.example.vet.Repository.GVentas.ServicioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicioService {

    private static final Logger logger = LoggerFactory.getLogger(ServicioService.class);

    @Autowired
    private ServicioRepository servicioRepository;

    @Autowired
    private TrabajadorRepository trabajadorRepository;

    public List<Servicio> listarActivos() {
        logger.info("MOSTRANDO SERVICIOS (ACTIVOS)");
        return servicioRepository.findAll().stream()
                .filter(s -> s.getEstado().equals(Servicio.EstadoServicio.ACTIVO))
                .toList();
    }

    public List<Servicio> listar() {
        logger.info("MOSTRANDO TODOS LOS SERVICIOS");
        return servicioRepository.findAll();
    }

    public Servicio crear(ServicioRequestDTO dto) {
        Servicio s = new Servicio();
        s.setNombre(dto.getNombre());
        s.setDescripcion(dto.getDescripcion());
        s.setIcono(dto.getIcono() != null ? dto.getIcono() : "pets");
        s.setPrecio(dto.getPrecio());
        s.setEstado(Servicio.EstadoServicio.valueOf(dto.getEstado()));

        // Asignar trabajadores
        asignarTrabajadores(s, dto.getTrabajadorIds());

        return servicioRepository.save(s);
    }

    public Servicio actualizar(Long id, ServicioRequestDTO dto) {
        Servicio s = servicioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        s.setNombre(dto.getNombre());
        s.setDescripcion(dto.getDescripcion());
        if (dto.getIcono() != null) s.setIcono(dto.getIcono());
        s.setPrecio(dto.getPrecio());
        s.setEstado(Servicio.EstadoServicio.valueOf(dto.getEstado()));

        // Reasignar trabajadores
        s.getTrabajadores().clear(); // limpia los anteriores
        asignarTrabajadores(s, dto.getTrabajadorIds());

        return servicioRepository.save(s);
    }

    //  método auxiliar
    private void asignarTrabajadores(Servicio servicio, List<Long> ids) {
        if (ids == null || ids.isEmpty()) return;
        List<Trabajador> trabajadores = trabajadorRepository.findAllById(ids);
        for (Trabajador t : trabajadores) {
            TrabajadorServicio ts = new TrabajadorServicio();
            ts.setServicio(servicio);
            ts.setTrabajador(t);
            servicio.getTrabajadores().add(ts);
        }
    }
}