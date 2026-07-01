package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.ClienteDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private static final Logger logger = LoggerFactory.getLogger(ClienteService.class);

    private final ClienteRepository clienteRepository;

    public List<ClienteDTO> listarTodosConContador() {
        logger.info("CLIENTES MOSTRADOS");
        return clienteRepository.findAllClientesConContador();
    }

    public Cliente guardar(Cliente cliente) {
        logger.info("CLIENTE GUARDADO CORRECTAMENTE");
        return clienteRepository.save(cliente);
    }

    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    public Cliente eliminar(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        cliente.setActivo(false);
        return clienteRepository.save(cliente);
    }

}