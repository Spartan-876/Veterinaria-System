package com.utp.veterinaria.Service.GMedica;

import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Repository.GMedica.MascotaRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MascotaService {

    private static final Logger logger = LoggerFactory.getLogger(MascotaService.class);

    private final MascotaRepository mascotaRepository;

    public List<Mascota> listarTodas(){
        logger.info("MASCOTAS LISTADAS");
        return mascotaRepository.findAll().stream()
                .filter(Mascota::isActivo)
                .toList();
    }

    public Mascota guardar(Mascota mascota){
        logger.info("MASCOTA GUARDADA CORRECTAMENTE" + mascota);
        return mascotaRepository.save(mascota);
    }

    public Mascota buscarPorId(Long id){
        logger.info("MASCOTA POR ID");
        return mascotaRepository.findById(id).orElse(null);
    }

    public void eliminar(Long id){
        Mascota mascota = mascotaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));
        mascota.setActivo(false);
        mascotaRepository.save(mascota);
        logger.info("Mascota desactivada: {}", id);
    }

    public List<Mascota> listarPorCliente(Long clienteId) {
        return mascotaRepository.findByClienteId(clienteId).stream()
                .filter(Mascota::isActivo)
                .toList();
    }
}
