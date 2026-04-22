package com.utp.veterinaria.ServiceTest;

import com.utp.veterinaria.DTO.CitaDTO;
import com.utp.veterinaria.DTO.CitaRequestDTO;
import com.utp.veterinaria.Model.GestionMedica.Mascota;
import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Model.GestionVentas.Servicio;
import com.utp.veterinaria.Repository.GMedica.MascotaRepository;
import com.utp.veterinaria.Repository.GUsuarios.CitaRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorRepository;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorServicioRepository;
import com.utp.veterinaria.Repository.GVentas.ServicioRepository;
import com.utp.veterinaria.Service.GUsuarios.CitaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CitaServiceTest {

    @Mock
    private CitaRepository citaRepository;
    @Mock
    private MascotaRepository mascotaRepository;
    @Mock
    private ServicioRepository servicioRepository;
    @Mock
    private TrabajadorRepository trabajadorRepository;
    @Mock
    private TrabajadorServicioRepository trabajadorServicioRepository;

    @InjectMocks
    private CitaService citaService;

    private CitaRequestDTO requestDTO;
    private Mascota mascota;
    private Servicio servicio;
    private Trabajador trabajador;

    @BeforeEach
    void setUp() {
        requestDTO = new CitaRequestDTO();
        requestDTO.setMascotaId(1L);
        requestDTO.setServicioId(1L);
        requestDTO.setTrabajadorId(1L);
        requestDTO.setFechaHora(LocalDateTime.now());
        requestDTO.setMotivo("Consulta general");

        mascota = new Mascota();
        mascota.setId(1L);
        mascota.setNombre("Firulais");

        servicio = new Servicio();
        servicio.setId(1L);
        servicio.setEstado(Servicio.EstadoServicio.ACTIVO);
        servicio.setPrecio(50.0);

        trabajador = new Trabajador();
        trabajador.setId(1L);
        trabajador.setEstado(Trabajador.estadoTrabajador.ACTIVO);
    }

    @Test
    @DisplayName("Debe crear una cita exitosamente cuando todos los datos son válidos")
    void crearCitaExitosamente() {
        // Arrange
        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascota));
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicio));
        when(trabajadorRepository.findById(1L)).thenReturn(Optional.of(trabajador));
        when(trabajadorServicioRepository.existsByTrabajadorIdAndServicioId(1L, 1L)).thenReturn(true);

        // Simulamos el guardado
        when(citaRepository.save(any(Cita.class))).thenAnswer(invocation -> {
            Cita cita = invocation.getArgument(0);
            cita.setId(100L); // Simulamos ID generado
            return cita;
        });

        // Act
        CitaDTO resultado = citaService.crearCita(requestDTO);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(100L);
        assertThat(resultado.getEstado()).isEqualTo("PENDIENTE");
        verify(citaRepository, times(1)).save(any(Cita.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción si el trabajador no ofrece el servicio")
    void crearCitaErrorTrabajadorNoOfreceServicio() {
        // Arrange
        when(mascotaRepository.findById(1L)).thenReturn(Optional.of(mascota));
        when(servicioRepository.findById(1L)).thenReturn(Optional.of(servicio));
        when(trabajadorRepository.findById(1L)).thenReturn(Optional.of(trabajador));
        when(trabajadorServicioRepository.existsByTrabajadorIdAndServicioId(1L, 1L)).thenReturn(false);

        // Act & Assert
        assertThatThrownBy(() -> citaService.crearCita(requestDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("El trabajador no ofrece este servicio");

        verify(citaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe cancelar una cita pendiente correctamente")
    void cancelarCitaExito() {
        // Arrange
        Cita citaExistente = new Cita();
        citaExistente.setId(1L);
        citaExistente.setEstado(Cita.EstadoCita.PENDIENTE);

        when(citaRepository.findById(1L)).thenReturn(Optional.of(citaExistente));
        when(citaRepository.save(any(Cita.class))).thenReturn(citaExistente);

        // Act
        CitaDTO resultado = citaService.cancelarCita(1L);

        // Assert
        assertThat(resultado.getEstado()).isEqualTo("CANCELADA");
        verify(citaRepository).save(citaExistente);
    }

    @Test
    @DisplayName("No debe permitir cancelar una cita que ya fue realizada")
    void cancelarCitaErrorYaRealizada() {
        // Arrange
        Cita citaRealizada = new Cita();
        citaRealizada.setId(1L);
        citaRealizada.setEstado(Cita.EstadoCita.REALIZADA);

        when(citaRepository.findById(1L)).thenReturn(Optional.of(citaRealizada));

        // Act & Assert
        assertThatThrownBy(() -> citaService.cancelarCita(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("No se puede cancelar una cita realizada");
    }
}
