package com.utp.veterinaria.ServiceTest;

import com.utp.veterinaria.DTO.TrabajadorServicioDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Trabajador;
import com.utp.veterinaria.Model.GestionUsuarios.TrabajadorServicio;
import com.utp.veterinaria.Repository.GUsuarios.TrabajadorServicioRepository;
import com.utp.veterinaria.Service.GUsuarios.TrabajadorServicioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrabajadorServicioServiceTest {

    @Mock
    private TrabajadorServicioRepository trabajadorServicioRepository;

    @InjectMocks
    private TrabajadorServicioService trabajadorServicioService;

    private TrabajadorServicio tsActivo;
    private TrabajadorServicio tsInactivo;

    @BeforeEach
    void setUp() {
        // Trabajador 1: Activo
        Trabajador t1 = new Trabajador();
        t1.setId(1L);
        t1.setNombres("Juan");
        t1.setApellidos("Pérez");
        t1.setCargo(Trabajador.cargoTrabajador.VETERINARIO);
        t1.setEstado(Trabajador.estadoTrabajador.ACTIVO);

        tsActivo = new TrabajadorServicio();
        tsActivo.setTrabajador(t1);

        // Trabajador 2: Inactivo
        Trabajador t2 = new Trabajador();
        t2.setId(2L);
        t2.setNombres("Ana");
        t2.setApellidos("Gómez");
        t2.setCargo(Trabajador.cargoTrabajador.ESTILISTA);
        t2.setEstado(Trabajador.estadoTrabajador.INACTIVO);

        tsInactivo = new TrabajadorServicio();
        tsInactivo.setTrabajador(t2);
    }

    @Test
    @DisplayName("Debe listar solo los trabajadores activos para un servicio dado")
    void obtenerTrabajadoresPorServicioFiltrado() {
        // Arrange
        Long servicioId = 10L;
        // Simulamos que el repo devuelve ambos (activo e inactivo)
        when(trabajadorServicioRepository.findByServicioId(servicioId))
                .thenReturn(Arrays.asList(tsActivo, tsInactivo));

        // Act
        List<TrabajadorServicioDTO> resultado = trabajadorServicioService.obtenerTrabajadoresPorServicio(servicioId);

        // Assert
        assertThat(resultado).hasSize(1);
        assertThat(resultado.get(0).getTrabajadorNombre()).isEqualTo("Juan Pérez");
        assertThat(resultado.get(0).getEstado()).isEqualTo("ACTIVO");

        // Verificar que Ana (Inactiva) fue filtrada
        assertThat(resultado.stream()
                .anyMatch(dto -> dto.getTrabajadorNombre().contains("Ana")))
                .isFalse();

        verify(trabajadorServicioRepository, times(1)).findByServicioId(servicioId);
    }

    @Test
    @DisplayName("Debe retornar lista vacía si no hay trabajadores para el servicio")
    void obtenerTrabajadoresVacio() {
        // Arrange
        when(trabajadorServicioRepository.findByServicioId(anyLong())).thenReturn(List.of());

        // Act
        List<TrabajadorServicioDTO> resultado = trabajadorServicioService.obtenerTrabajadoresPorServicio(1L);

        // Assert
        assertThat(resultado).isEmpty();
    }

    @Test
    @DisplayName("Debe mapear correctamente los campos del Trabajador al DTO")
    void validarMapeoDTO() {
        // Arrange
        when(trabajadorServicioRepository.findByServicioId(1L)).thenReturn(List.of(tsActivo));

        // Act
        TrabajadorServicioDTO dto = trabajadorServicioService.obtenerTrabajadoresPorServicio(1L).get(0);

        // Assert
        assertThat(dto.getTrabajadorId()).isEqualTo(1L);
        assertThat(dto.getCargo()).isEqualTo("VETERINARIO");
        assertThat(dto.getTrabajadorNombre()).isEqualTo("Juan Pérez");
    }
}