package com.utp.veterinaria.Controller.GMedica;

import com.utp.veterinaria.DTO.EspecieDTO;
import com.utp.veterinaria.Repository.GMedica.EspecieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/especies")
@RequiredArgsConstructor
public class EspecieController {

    private final EspecieRepository especieRepository;

    @GetMapping
    public ResponseEntity<List<EspecieDTO>> listar() {
        return ResponseEntity.ok(
                especieRepository.findAll()
                        .stream()
                        .map(e -> {
                            EspecieDTO dto = new EspecieDTO();
                            dto.setId(e.getId());
                            dto.setNombre(e.getNombre());
                            return dto;
                        })
                        .collect(Collectors.toList())
        );
    }
}