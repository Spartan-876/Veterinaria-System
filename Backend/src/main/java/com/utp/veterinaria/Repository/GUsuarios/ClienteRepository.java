package com.utp.veterinaria.Repository.GUsuarios;

import com.utp.veterinaria.DTO.ClienteDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    @Query("SELECT new com.utp.veterinaria.DTO.ClienteDTO(" +
            "c.id, c.dni, c.nombres, c.apellidos, c.direccion, c.telefono, c.correo, " +
            "size(c.mascotas)) " +
            "FROM Cliente c WHERE c.activo = true")
    List<ClienteDTO> findAllClientesConContador();

    boolean existsByDni(String dni);

    Optional<Cliente> findByDni(String dni);
}
