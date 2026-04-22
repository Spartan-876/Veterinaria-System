package com.utp.veterinaria.Service.GUsuarios;
import com.utp.veterinaria.DTO.CitaDTO;
import com.utp.veterinaria.DTO.CitaRequestDTO;
import com.utp.veterinaria.DTO.DashboardDTO;
import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Model.GestionVentas.Servicio;
import com.utp.veterinaria.Repository.GMedica.MascotaRepository;
import com.utp.veterinaria.Repository.GUsuarios.CitaRepository;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorServicioRepository;
import com.utp.veterinaria.Repository.GVentas.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CitaService {

    private final CitaRepository citaRepository;

    private final MascotaRepository mascotaRepository;

    private final ServicioRepository servicioRepository;

    private final TrabajadorRepository trabajadorRepository;

    private final ClienteRepository clienteRepository;

    private final TrabajadorServicioRepository trabajadorServicioRepository;

    public List<CitaDTO> listarCitas() {
        return citaRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private CitaDTO toDTO(Cita cita) {
        CitaDTO dto = new CitaDTO();
        dto.setId(cita.getId());
        dto.setFechaHora(cita.getFechaHora());
        dto.setMotivo(cita.getMotivo());
        dto.setEstado(cita.getEstado().name());

        // Datos de la mascota
        if (cita.getMascota() != null) {
            dto.setMascotaId(cita.getMascota().getId());
            dto.setMascotaNombre(cita.getMascota().getNombre());

            // Datos del cliente (dueño de la mascota)
            if (cita.getMascota().getCliente() != null) {
                dto.setClienteId(cita.getMascota().getCliente().getId());
                dto.setClienteNombre(
                        cita.getMascota().getCliente().getNombres() + " " +
                                cita.getMascota().getCliente().getApellidos()
                );
            }
        }

        // Datos del trabajador
        if (cita.getTrabajador() != null) {
            dto.setTrabajadorId(cita.getTrabajador().getId());
            dto.setTrabajadorNombre(
                    cita.getTrabajador().getNombres() + " " +
                            cita.getTrabajador().getApellidos()
            );
        }

        // Dentro de toDTO() — verifica que tengas esto
        if (cita.getServicio() != null) {
            dto.setServicioId(cita.getServicio().getId());
            dto.setServicioNombre(cita.getServicio().getNombre());
            dto.setPrecioServicio(cita.getServicio().getPrecio());
        }

        return dto;
    }


    public CitaDTO crearCita(CitaRequestDTO request) {

        // 1. Validar que la mascota existe
        Mascota mascota = mascotaRepository.findById(request.getMascotaId())
                .orElseThrow(() -> new RuntimeException("Mascota no encontrada"));

        // 2. Validar que el servicio existe y está activo
        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        if (servicio.getEstado() == Servicio.EstadoServicio.INACTIVO) {
            throw new RuntimeException("El servicio no está disponible");
        }

        // 3. Validar que el trabajador existe y está activo
        Trabajador trabajador = trabajadorRepository.findById(request.getTrabajadorId())
                .orElseThrow(() -> new RuntimeException("Trabajador no encontrado"));

        if (trabajador.getEstado() == Trabajador.estadoTrabajador.INACTIVO) {
            throw new RuntimeException("El trabajador no está disponible");
        }

        // 4. Validar que ese trabajador realmente ofrece ese servicio
        boolean puedeRealizarlo = trabajadorServicioRepository
                .existsByTrabajadorIdAndServicioId(
                        request.getTrabajadorId(),
                        request.getServicioId()
                );

        if (!puedeRealizarlo) {
            throw new RuntimeException("El trabajador no ofrece este servicio");
        }

        // 5. Crear y guardar la cita
        Cita cita = new Cita();
        cita.setMascota(mascota);
        cita.setServicio(servicio);
        cita.setTrabajador(trabajador);
        cita.setFechaHora(request.getFechaHora());
        cita.setMotivo(request.getMotivo());
        cita.setEstado(Cita.EstadoCita.PENDIENTE);

        return toDTO(citaRepository.save(cita));
    }

    public DashboardDTO getDashboard() {
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioHoy = hoy.atStartOfDay();
        LocalDateTime finHoy = hoy.atTime(23, 59, 59);

        LocalDateTime inicioMes = hoy.withDayOfMonth(1).atStartOfDay();
        LocalDateTime finMes = hoy.withDayOfMonth(
                hoy.lengthOfMonth()).atTime(23, 59, 59);

        DashboardDTO dto = new DashboardDTO();

        // Citas de hoy
        List<Cita> citasHoy = citaRepository
                .findByFechaHoraBetween(inicioHoy, finHoy);
        dto.setCitasHoy(citasHoy.size());
        dto.setCitasDeHoy(citasHoy.stream()
                .map(this::toDTO)
                .collect(Collectors.toList()));

        // Ventas del mes (solo REALIZADAS)
        double ventas = citaRepository
                .findByFechaHoraBetween(inicioMes, finMes)
                .stream()
                .filter(c -> c.getEstado() == Cita.EstadoCita.REALIZADA)
                .filter(c -> c.getServicio() != null)
                .mapToDouble(c -> c.getServicio().getPrecio())
                .sum();
        dto.setVentasMes(ventas);

        // Clientes y mascotas
        dto.setClientesActivos(clienteRepository.count());
        dto.setTotalMascotas(mascotaRepository.count());

        return dto;
    }

    public List<CitaDTO> listarPorCliente(Long clienteId) {
        return citaRepository.findByMascotaClienteId(clienteId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CitaDTO cancelarCita(Long id) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        if (cita.getEstado() == Cita.EstadoCita.REALIZADA) {
            throw new RuntimeException("No se puede cancelar una cita realizada");
        }
        cita.setEstado(Cita.EstadoCita.CANCELADA);
        return toDTO(citaRepository.save(cita));
    }

    public CitaDTO cambiarEstado(Long id, String estado) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
        cita.setEstado(Cita.EstadoCita.valueOf(estado));
        return toDTO(citaRepository.save(cita));
    }

    public List<Trabajador> trabajadoresDisponibles(Long servicioId, LocalDateTime fechaHora) {
        // Trabajadores que ofrecen el servicio
        List<Trabajador> candidatos = trabajadorServicioRepository
                .findByServicioId(servicioId)
                .stream()
                .map(ts -> ts.getTrabajador())
                .filter(t -> t.getEstado() == Trabajador.estadoTrabajador.ACTIVO)
                .collect(Collectors.toList());

        LocalDateTime fin = fechaHora.plusHours(1);
        return candidatos.stream()
                .filter(t -> citaRepository
                        .findByTrabajadorIdAndFechaHoraBetween(t.getId(), fechaHora, fin)
                        .stream()
                        .noneMatch(c -> c.getEstado() != Cita.EstadoCita.CANCELADA))
                .collect(Collectors.toList());
    }

}
