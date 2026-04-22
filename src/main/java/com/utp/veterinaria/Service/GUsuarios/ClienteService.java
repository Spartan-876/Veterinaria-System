package com.utp.veterinaria.Service.GUsuarios;

import com.example.vet.DTO.ClienteDTO;
import com.example.vet.Model.GestionUsuarios.Cliente;
import com.example.vet.Repository.GUsuarios.ClienteRepository;
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

}