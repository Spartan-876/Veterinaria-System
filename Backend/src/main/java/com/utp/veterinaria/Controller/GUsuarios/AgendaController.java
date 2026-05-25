package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.Config.JwtUtil;
import com.utp.veterinaria.DTO.AgendaDTO;
import com.utp.veterinaria.Service.GUsuarios.AgendaService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;
    private final JwtUtil jwtUtil;

    @GetMapping("/mi-agenda")
    public ResponseEntity<AgendaDTO> getMiAgenda(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Long trabajadorId = jwtUtil.getTrabajadorIdFromToken(token);

        if (trabajadorId == null) {
            return ResponseEntity.badRequest().build();
        }

        AgendaDTO agenda = agendaService.getMiAgenda(trabajadorId);
        return ResponseEntity.ok(agenda);
    }
}