package com.utp.veterinaria.Service.GMedica;

import com.example.vet.Model.GestionMedica.VacunaCatalogo;
import com.example.vet.Repository.GMedica.VacunaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VacunaService {

    private static final Logger logger = LoggerFactory.getLogger(VacunaService.class);

    private final VacunaRepository vacunaRepository;

    public List<VacunaCatalogo> listarTodas() {
        logger.info("VACUNAS LISTADAS");
        return vacunaRepository.findAll();
    }

    public VacunaCatalogo guardar(VacunaCatalogo vacuna) {
        logger.info("VACUNA GUARDADA");
        return vacunaRepository.save(vacuna);
    }

    public VacunaCatalogo buscarPorId(Long id) {
        logger.info("VACUNA BUSCADA POR ID");
        return vacunaRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        logger.info("VACUNA ELIMINADAS");
        vacunaRepository.deleteById(id);
    }

    public VacunaCatalogo actualizar(Long id, VacunaCatalogo vacuna) {
        VacunaCatalogo vacunaExistente = buscarPorId(id);
        if (vacunaExistente != null) {
            vacunaExistente.setNombre(vacuna.getNombre());
            vacunaExistente.setFabricante(vacuna.getFabricante());
            vacunaExistente.setPrecio(vacuna.getPrecio());
            vacunaExistente.setDosis(vacuna.getDosis());
            vacunaExistente.setEdadRecomendada(vacuna.getEdadRecomendada());
            vacunaExistente.setEnfermedadAsociada(vacuna.getEnfermedadAsociada());
            return guardar(vacunaExistente);
        }
        return null;
    }
}