package com.utp.veterinaria.Controller.GUsuarios;

import com.utp.veterinaria.DTO.ClienteDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Service.GUsuarios.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping("/crearCliente")
    public ResponseEntity<Cliente> crear(@RequestBody @Valid Cliente cliente) {
        return ResponseEntity.ok(clienteService.guardar(cliente));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtenerPorId(@PathVariable Long id) {
        Cliente cliente = clienteService.buscarPorId(id);
        return cliente != null ? ResponseEntity.ok(cliente) : ResponseEntity.notFound().build();
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<Cliente> obtenerPorDni(@PathVariable String dni) {
        return clienteService.buscarPorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<ClienteDTO> listar() {
        return clienteService.listarTodosConContador();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Cliente>> buscar(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(clienteService.buscarClientes(q.trim()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

}