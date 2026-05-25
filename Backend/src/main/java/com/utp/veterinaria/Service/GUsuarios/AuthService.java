package com.utp.veterinaria.Service.GUsuarios;

import com.utp.veterinaria.Config.JwtUtil;
import com.utp.veterinaria.DTO.LoginRequest;
import com.utp.veterinaria.DTO.LoginResponse;
import com.utp.veterinaria.DTO.ModuloDTO;
import com.utp.veterinaria.DTO.RegistroClienteDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Model.GestionUsuarios.Rol;
import com.utp.veterinaria.Model.GestionUsuarios.Usuario;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GUsuarios.RolRepository;
import com.utp.veterinaria.Repository.GUsuarios.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        System.out.println("Trabajador: " + usuario.getTrabajador());
        System.out.println("Cliente: " + usuario.getCliente());

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String rol = usuario.getRoles().stream()
                .findFirst()
                .map(Rol::getNombre)
                .orElse("ROLE_USER");

        List<String> roles = usuario.getRoles().stream()
                .map(Rol::getNombre)
                .collect(Collectors.toList());

        // Obtener módulos de todos los roles del usuario (objetos completos)
        List<ModuloDTO> modulosDTO = usuario.getRoles().stream()
                .flatMap(r -> r.getModulos().stream())
                .distinct()
                .map(m -> new ModuloDTO(
                    m.getId(), m.getNombre(), m.getDescripcion(),
                    m.getNombreMostrar(), m.getRuta(), m.getIcono(),
                    m.getOrden(), m.getGrupo()
                ))
                .collect(Collectors.toList());

        List<String> nombresModulos = modulosDTO.stream()
                .map(ModuloDTO::getNombre)
                .collect(Collectors.toList());

        Long trabajadorId = usuario.getTrabajador() != null
                ? usuario.getTrabajador().getId()
                : null;

        Long clienteId = usuario.getCliente() != null
                ? usuario.getCliente().getId()
                : null;

        String nombre;
        if (usuario.getTrabajador() != null) {
            nombre = usuario.getTrabajador().getNombres();
        } else if (usuario.getCliente() != null) {
            nombre = usuario.getCliente().getNombres();
        } else {
            throw new IllegalStateException(
                "Usuario sin perfil de trabajador o cliente asociado: " + usuario.getCorreo()
            );
        }

        String token = jwtUtil.generarToken(usuario.getCorreo(), rol, nombresModulos, trabajadorId);

        return new LoginResponse(token, usuario.getCorreo(), rol, roles, modulosDTO, trabajadorId, nombre, clienteId);
    }

    public void registrarCliente(RegistroClienteDTO dto) {

        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        if (clienteRepository.existsByDni(dto.getDni())) {
            throw new RuntimeException("El DNI ya está registrado");
        }

        Cliente cliente = new Cliente();
        cliente.setNombres(dto.getNombres().toUpperCase());
        cliente.setApellidos(dto.getApellidos().toUpperCase());
        cliente.setDni(dto.getDni());
        cliente.setTelefono(dto.getTelefono());
        cliente.setCorreo(dto.getCorreo());
        cliente.setDireccion(dto.getDireccion());
        clienteRepository.save(cliente);

        Usuario usuario = new Usuario();
        usuario.setCorreo(dto.getCorreo());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setEstado(Usuario.estadoUsuario.ACTIVO);
        usuario.setCliente(cliente);

        Rol rolUser = rolRepository.findByNombre("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        Set<Rol> roles = new HashSet<>();
        roles.add(rolUser);
        usuario.setRoles(roles);
        usuarioRepository.save(usuario);
    }
}