package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.DTO.UsuarioDTO;
import com.utp.veterinaria.DTO.UsuarioRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Model.GestionUsuarios.Rol;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Model.GestionUsuarios.Usuario;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GUsuarios.RolRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorRepository;
import com.utp.veterinaria.Repository.GUsuarios.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ClienteRepository clienteRepository;
    private final TrabajadorRepository trabajadorRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .filter(u -> u.getEstado() == Usuario.estadoUsuario.ACTIVO)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
        return toDTO(usuario);
    }

    public UsuarioDTO buscarPorCorreo(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + correo));
        return toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO crear(UsuarioRequestDTO dto) {
        if (usuarioRepository.findByCorreo(dto.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setCorreo(dto.getCorreo());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setEstado(Usuario.estadoUsuario.valueOf(dto.getEstado()));

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            usuario.setCliente(cliente);
        }

        if (dto.getTrabajadorId() != null) {
            Trabajador trabajador = trabajadorRepository.findById(dto.getTrabajadorId())
                    .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
            usuario.setTrabajador(trabajador);
        }

        Set<Rol> roles = new HashSet<>();
        if (dto.getRoles() != null) {
            for (String rolNombre : dto.getRoles()) {
                Rol rol = rolRepository.findByNombre(rolNombre)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rolNombre));
                roles.add(rol);
            }
        }
        usuario.setRoles(roles);

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getEstado() != null) {
            usuario.setEstado(Usuario.estadoUsuario.valueOf(dto.getEstado()));
        }

        if (dto.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
            usuario.setCliente(cliente);
        }

        if (dto.getTrabajadorId() != null) {
            Trabajador trabajador = trabajadorRepository.findById(dto.getTrabajadorId())
                    .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));
            usuario.setTrabajador(trabajador);
        }

        if (dto.getRoles() != null) {
            Set<Rol> roles = new HashSet<>();
            for (String rolNombre : dto.getRoles()) {
                Rol rol = rolRepository.findByNombre(rolNombre)
                        .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rolNombre));
                roles.add(rol);
            }
            usuario.setRoles(roles);
        }

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));
        usuario.setEstado(Usuario.estadoUsuario.INACTIVO);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public UsuarioDTO asignarRoles(Long id, List<String> rolesNombres) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));

        Set<Rol> roles = new HashSet<>();
        for (String rolNombre : rolesNombres) {
            Rol rol = rolRepository.findByNombre(rolNombre)
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado: " + rolNombre));
            roles.add(rol);
        }
        usuario.setRoles(roles);

        usuario = usuarioRepository.save(usuario);
        return toDTO(usuario);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        String nombreCliente = null;
        String nombreTrabajador = null;
        
        if (usuario.getCliente() != null) {
            nombreCliente = usuario.getCliente().getNombres() + " " + usuario.getCliente().getApellidos();
        }
        if (usuario.getTrabajador() != null) {
            nombreTrabajador = usuario.getTrabajador().getNombres() + " " + usuario.getTrabajador().getApellidos();
        }

        List<String> roles = usuario.getRoles().stream()
                .map(Rol::getNombre)
                .collect(Collectors.toList());

        return new UsuarioDTO(
                usuario.getId(),
                usuario.getCorreo(),
                usuario.getEstado().name(),
                usuario.getCliente() != null ? usuario.getCliente().getId() : null,
                usuario.getTrabajador() != null ? usuario.getTrabajador().getId() : null,
                nombreCliente,
                nombreTrabajador,
                roles
        );
    }
}