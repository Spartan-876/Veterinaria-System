package com.utp.veterinaria.Service.GUsuarios;

import com.example.vet.Model.GestionUsuarios.Horario;
import com.example.vet.Repository.GUsuarios.HorarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HorarioService {

    private final HorarioRepository horarioRepository;

    public List<Horario> buscarPorTrabajador(Long trabajadorId) {
        return horarioRepository.findByTrabajadorId(trabajadorId);
    }

    public Horario guardar(Horario horario) {
        return horarioRepository.save(horario);
    }

    public void eliminar(Long id) {
        horarioRepository.deleteById(id);
    }
}