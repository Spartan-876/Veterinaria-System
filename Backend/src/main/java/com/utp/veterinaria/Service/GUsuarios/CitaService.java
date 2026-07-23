package com.utp.veterinaria.Service.GUsuarios;
import com.utp.veterinaria.DTO.CitaDTO;
import com.utp.veterinaria.DTO.CitaRequestDTO;
import com.utp.veterinaria.DTO.DashboardDTO;
import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Model.GestionVentas.Pago;
import com.utp.veterinaria.Model.GestionVentas.Servicio;
import com.utp.veterinaria.Repository.GMedica.MascotaRepository;
import com.utp.veterinaria.Repository.GUsuarios.CitaRepository;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorServicioRepository;
import com.utp.veterinaria.Repository.GVentas.PagoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.utp.veterinaria.Repository.GVentas.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private final PagoRepository pagoRepository;

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

        if (cita.getPago() != null) {
            dto.setPagoId(cita.getPago().getId());
            dto.setPagoMetodo(cita.getPago().getMetodoPago());
            dto.setPagoFecha(cita.getPago().getFechaPago());
        }

        return dto;
    }


    public CitaDTO crearCita(CitaRequestDTO request) {

        // 0. Validar que la fecha sea futura
        if (request.getFechaHora() == null) {
            throw new RuntimeException("La fecha y hora son obligatorias");
        }
        if (request.getFechaHora().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("La fecha de la cita debe ser en el futuro");
        }

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

        // 5. Verificar que no haya otra cita en el mismo horario para el mismo trabajador
        LocalDateTime fin = request.getFechaHora().plusHours(1);
        List<Cita> citasSolapadas = citaRepository
                .findByTrabajadorIdAndFechaHoraBetween(
                        request.getTrabajadorId(), request.getFechaHora(), fin);
        boolean haySolapamiento = citasSolapadas.stream()
                .anyMatch(c -> c.getEstado() != Cita.EstadoCita.CANCELADA);
        if (haySolapamiento) {
            throw new RuntimeException("El trabajador ya tiene una cita programada en ese horario");
        }

        // 6. Crear y guardar la cita
        Cita cita = new Cita();
        cita.setMascota(mascota);
        cita.setServicio(servicio);
        cita.setTrabajador(trabajador);
        cita.setFechaHora(request.getFechaHora());
        cita.setMotivo(request.getMotivo());
        cita.setEstado(Cita.EstadoCita.PENDIENTE);

        return toDTO(citaRepository.save(cita));
    }


public DashboardDTO getDashboard(List<String> modulos, Long trabajadorId) {
    LocalDate hoy = LocalDate.now();
    LocalDateTime inicioHoy = hoy.atStartOfDay();
    LocalDateTime finHoy = hoy.atTime(23, 59, 59);
    LocalDateTime inicioMes = hoy.withDayOfMonth(1).atStartOfDay();
    LocalDateTime finMes = hoy.withDayOfMonth(hoy.lengthOfMonth()).atTime(23, 59, 59);

    DashboardDTO dto = new DashboardDTO();

    // Métricas globales (disponibles para todos los roles)
    dto.setClientesActivos(clienteRepository.count());
    dto.setTotalMascotas(mascotaRepository.count());
    dto.setTotalMedicos(trabajadorRepository.countMedicosActivos());
    dto.setTotalCitasProgramadas(citaRepository.countCitasProgramadas());

    boolean tieneCitas = modulos != null && modulos.contains("CITAS");
    boolean tieneClientes = modulos != null && modulos.contains("CLIENTES");
    boolean tieneVentas = modulos != null && modulos.contains("VENTAS");

    if (tieneCitas) {
        if (tieneClientes || tieneVentas) {
            // Vista de admin: todas las citas
            dto.setCitasHoy(citaRepository.countCitasHoy(inicioHoy, finHoy));
            dto.setVentasMes(citaRepository.sumVentasMes(inicioMes, finMes));
            dto.setCitasDeHoy(citaRepository.findByFechaHoraBetween(inicioHoy, finHoy)
                    .stream().map(this::toDTO).collect(Collectors.toList()));
        } else if (trabajadorId != null) {
            // Vista de médico: solo sus citas
            dto.setCitasHoy(citaRepository.countCitasHoyTrabajador(trabajadorId, inicioHoy, finHoy));
            dto.setVentasMes(citaRepository.sumVentasMesTrabajador(trabajadorId, inicioMes, finMes));
            dto.setCitasDeHoy(citaRepository.findByTrabajadorIdAndFechaHoraBetween(
                    trabajadorId, inicioHoy, finHoy)
                    .stream().map(this::toDTO).collect(Collectors.toList()));
        }
    }

    return dto;
}

    public List<CitaDTO> listarPorCliente(Long clienteId) {
        return citaRepository.findByMascotaClienteId(clienteId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<CitaDTO> listarPorMascota(Long mascotaId) {
        return citaRepository.findByMascotaIdOrderByFechaHoraDesc(mascotaId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CitaDTO cambiarEstado(Long id, String estado) {
        Cita cita = citaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        Cita.EstadoCita nuevoEstado;
        try {
            nuevoEstado = Cita.EstadoCita.valueOf(estado);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado invalido: " + estado);
        }

        // Validar transiciones consecutivas (sin retroceso)
        Cita.EstadoCita actual = cita.getEstado();
        boolean transicionValida = switch (actual) {
            case PENDIENTE -> nuevoEstado == Cita.EstadoCita.CONFIRMADA
                    || nuevoEstado == Cita.EstadoCita.CANCELADA;
            case CONFIRMADA -> nuevoEstado == Cita.EstadoCita.REALIZADA;
            case REALIZADA, CANCELADA -> false;
        };

        if (!transicionValida) {
            throw new RuntimeException("No se puede cambiar de " + actual + " a " + nuevoEstado);
        }

        cita.setEstado(nuevoEstado);
        return toDTO(citaRepository.save(cita));
    }

    @Transactional
    public CitaDTO registrarPagoCita(Long citaId, Double monto, String metodoPago) {
        Cita cita = citaRepository.findById(citaId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if (cita.getEstado() != Cita.EstadoCita.PENDIENTE && cita.getEstado() != Cita.EstadoCita.CONFIRMADA) {
            throw new RuntimeException("La cita no está en estado válido para pago");
        }

        if (cita.getPago() != null) {
            throw new RuntimeException("Esta cita ya tiene un pago registrado");
        }

        if (cita.getServicio() == null || cita.getServicio().getPrecio() == null) {
            throw new RuntimeException("La cita no tiene servicio con precio definido");
        }

        // Validar monto = precio del servicio
        Double precioServicio = cita.getServicio().getPrecio();
        if (monto == null) {
            monto = precioServicio;
        }
        if (monto.compareTo(precioServicio) != 0) {
            throw new RuntimeException("El monto debe ser igual al precio del servicio: S/ " + precioServicio);
        }

        // Crear pago
        Pago pago = new Pago();
        pago.setCita(cita);
        pago.setMonto(monto);
        pago.setMetodoPago(metodoPago);
        pago.setComentario("Pago de cita - " + cita.getServicio().getNombre());
        pagoRepository.save(pago);

        // Cambiar estado a CONFIRMADA
        cita.setEstado(Cita.EstadoCita.CONFIRMADA);
        citaRepository.save(cita);

        return toDTO(cita);
    }

    @Scheduled(fixedRate = 300000) // Cada 5 minutos
    @Transactional
    public void cancelarCitasVencidas() {
        LocalDateTime limite = LocalDateTime.now().minusMinutes(30);
        List<Cita> citasVencidas = citaRepository.findCitasPendientesVencidas(limite);

        for (Cita cita : citasVencidas) {
            cita.setEstado(Cita.EstadoCita.CANCELADA);
            citaRepository.save(cita);
        }
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
