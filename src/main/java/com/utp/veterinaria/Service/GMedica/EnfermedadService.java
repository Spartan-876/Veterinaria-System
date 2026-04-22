package com.utp.veterinaria.Service.GMedica;

import com.example.vet.DTO.EnfermedadDTO;
import com.example.vet.DTO.EnfermedadRequestDTO;
import com.example.vet.DTO.EspecieDTO;
import com.example.vet.Model.GestionMedica.Enfermedad;
import com.example.vet.Model.GestionMedica.Especie;
import com.example.vet.Repository.GMedica.EnfermedadRepository;
import com.example.vet.Repository.GMedica.EspecieRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnfermedadService {

    private static final Logger logger = LoggerFactory.getLogger(EnfermedadService.class);

    private final EnfermedadRepository enfermedadRepository;

    private final EspecieRepository especieRepository;

    public List<Enfermedad> listarTodas(){
        logger.info("Listado de las enfermedades");
        return enfermedadRepository.findAll();
    }

    public Enfermedad guardar (Enfermedad enfermedad){
        return enfermedadRepository.save(enfermedad);
    }

    public Enfermedad buscarPorId(Long id) {
        logger.info("Busqueda por id");
        return enfermedadRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        logger.info("Enfermedad guardada en el sistema", id);
        enfermedadRepository.deleteById(id);
    }

    public EnfermedadDTO actualizar(Long id, EnfermedadRequestDTO request) {

        Enfermedad enfermedad = enfermedadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enfermedad no encontrada"));

        enfermedad.setNombre(request.getNombre());
        enfermedad.setDescripcion(request.getDescripcion());
        enfermedad.setGravedad(request.getGravedad());

        // Busca las especies por los IDs que mandó el frontend
        List<Especie> especies = especieRepository.findAllById(request.getEspeciesIds());
        enfermedad.setEspecies(especies);

        return toDTO(enfermedadRepository.save(enfermedad));
    }

    private EnfermedadDTO toDTO(Enfermedad e) {
        EnfermedadDTO dto = new EnfermedadDTO();
        dto.setId(e.getId());
        dto.setNombre(e.getNombre());
        dto.setDescripcion(e.getDescripcion());
        dto.setGravedad(e.getGravedad());
        dto.setEspecies(e.getEspecies().stream().map(esp -> {
            EspecieDTO edto = new EspecieDTO();
            edto.setId(esp.getId());
            edto.setNombre(esp.getNombre());
            return edto;
        }).collect(Collectors.toList()));
        return dto;
    }
    public EnfermedadDTO crear(EnfermedadRequestDTO request) {
        Enfermedad enfermedad = new Enfermedad();
        logger.info("Nueva enfermedad registrada", enfermedad);
        enfermedad.setNombre(request.getNombre());
        enfermedad.setDescripcion(request.getDescripcion());
        enfermedad.setGravedad(request.getGravedad());

        List<Especie> especies = especieRepository.findAllById(request.getEspeciesIds());
        enfermedad.setEspecies(especies);

        return toDTO(enfermedadRepository.save(enfermedad));

    }

}
