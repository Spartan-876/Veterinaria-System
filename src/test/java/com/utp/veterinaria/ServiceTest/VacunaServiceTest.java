package com.utp.veterinaria.ServiceTest;

import com.utp.veterinaria.Model.GestionMedica.VacunaCatalogo;
import com.utp.veterinaria.Repository.GMedica.VacunaRepository;
import com.utp.veterinaria.Service.GMedica.VacunaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VacunaServiceTest {

    @Mock
    private VacunaRepository vacunaRepository;

    @InjectMocks
    private VacunaService vacunaService;

    private VacunaCatalogo vacunaBase;

    @BeforeEach
    void setUp() {
        vacunaBase = new VacunaCatalogo();
        vacunaBase.setId(1L);
        vacunaBase.setNombre("Antirrábica");
        vacunaBase.setFabricante("LabVet");
        vacunaBase.setPrecio(25.0);
        vacunaBase.setDosis(1);
        vacunaBase.setEdadRecomendada(3);
    }

    @Test
    @DisplayName("Debe listar todas las vacunas del catálogo")
    void listarTodasTest() {
        // Arrange
        when(vacunaRepository.findAll()).thenReturn(Arrays.asList(vacunaBase, new VacunaCatalogo()));

        // Act
        List<VacunaCatalogo> resultado = vacunaService.listarTodas();

        // Assert
        assertThat(resultado).hasSize(2);
        verify(vacunaRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Debe buscar una vacuna por ID exitosamente")
    void buscarPorIdExito() {
        // Arrange
        when(vacunaRepository.findById(1L)).thenReturn(Optional.of(vacunaBase));

        // Act
        VacunaCatalogo resultado = vacunaService.buscarPorId(1L);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Antirrábica");
    }

    @Test
    @DisplayName("Debe retornar null cuando la vacuna no existe")
    void buscarPorIdNull() {
        // Arrange
        when(vacunaRepository.findById(99L)).thenReturn(Optional.empty());

        // Act
        VacunaCatalogo resultado = vacunaService.buscarPorId(99L);

        // Assert
        assertThat(resultado).isNull();
    }

    @Test
    @DisplayName("Debe actualizar todos los campos de una vacuna existente")
    void actualizarExito() {
        // Arrange
        VacunaCatalogo datosNuevos = new VacunaCatalogo();
        datosNuevos.setNombre("Quíntuple");
        datosNuevos.setFabricante("Pfizer");
        datosNuevos.setPrecio(45.0);
        datosNuevos.setDosis(2);
        datosNuevos.setEdadRecomendada(6);

        when(vacunaRepository.findById(1L)).thenReturn(Optional.of(vacunaBase));
        // El servicio llama internamente a guardar(), así que mockeamos el save
        when(vacunaRepository.save(any(VacunaCatalogo.class))).thenAnswer(i -> i.getArgument(0));

        // Act
        VacunaCatalogo resultado = vacunaService.actualizar(1L, datosNuevos);

        // Assert
        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Quíntuple");
        assertThat(resultado.getPrecio()).isEqualTo(45.0);
        assertThat(resultado.getFabricante()).isEqualTo("Pfizer");

        // Verificamos que se llamó a save con el objeto modificado
        verify(vacunaRepository).save(vacunaBase);
    }

    @Test
    @DisplayName("Debe retornar null al intentar actualizar una vacuna que no existe")
    void actualizarInexistente() {
        // Arrange
        when(vacunaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        VacunaCatalogo resultado = vacunaService.actualizar(1L, new VacunaCatalogo());

        // Assert
        assertThat(resultado).isNull();
        verify(vacunaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe llamar al repositorio para eliminar una vacuna")
    void eliminarTest() {
        // Act
        vacunaService.eliminar(1L);

        // Assert
        verify(vacunaRepository, times(1)).deleteById(1L);
    }
}