package com.utp.veterinaria.Repository.GUsuarios;

import com.utp.veterinaria.DTO.ClienteDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT new com.example.vet.DTO.ClienteDTO(" +
            "c.id, c.dni, c.nombres, c.apellidos, c.direccion, c.telefono, c.correo, " +
            "size(c.mascotas)) " +
            "FROM Cliente c")
    List<ClienteDTO> findAllClientesConContador();

    boolean existsByDni(String dni);
}
