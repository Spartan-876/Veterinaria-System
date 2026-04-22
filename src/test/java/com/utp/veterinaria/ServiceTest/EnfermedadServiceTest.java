package com.utp.veterinaria.ServiceTest;

import com.utp.veterinaria.DTO.EnfermedadDTO;
import com.utp.veterinaria.DTO.EnfermedadRequestDTO;
import com.utp.veterinaria.Model.GestionMedica.Enfermedad;
import com.utp.veterinaria.Model.GestionMedica.Especie;
import com.utp.veterinaria.Repository.GMedica.EnfermedadRepository;
import com.utp.veterinaria.Repository.GMedica.EspecieRepository;
import com.utp.veterinaria.Service.GMedica.EnfermedadService;
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
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnfermedadServiceTest {

    @Mock
    private EnfermedadRepository enfermedadRepository;

    @Mock
    private EspecieRepository especieRepository;

    @InjectMocks
    private EnfermedadService enfermedadService;

    private EnfermedadRequestDTO requestDTO;
    private Especie especiePerro;
    private Enfermedad enfermedadExistente;

    @BeforeEach
    void setUp() {

        especiePerro = new Especie();
        especiePerro.setId(1L);
        especiePerro.setNombre("Perro");


        requestDTO = new EnfermedadRequestDTO();
        requestDTO.setNombre("Parvovirus");
        requestDTO.setDescripcion("Infección viral grave");
        requestDTO.setGravedad("ALTA");
        requestDTO.setEspeciesIds(Arrays.asList(1L));


        enfermedadExistente = new Enfermedad();
        enfermedadExistente.setId(10L);
        enfermedadExistente.setNombre("Gripe");
        enfermedadExistente.setEspecies(Arrays.asList(especiePerro));
    }

    @Test
    @DisplayName("Debe crear una enfermedad y retornar el DTO correctamente")
    void crearEnfermedadExito() {

        when(especieRepository.findAllById(any())).thenReturn(Arrays.asList(especiePerro));
        when(enfermedadRepository.save(any(Enfermedad.class))).thenAnswer(i -> {
            Enfermedad e = i.getArgument(0);
            e.setId(1L);
            return e;
        });


        EnfermedadDTO resultado = enfermedadService.crear(requestDTO);


        assertThat(resultado).isNotNull();
        assertThat(resultado.getNombre()).isEqualTo("Parvovirus");
        assertThat(resultado.getEspecies()).hasSize(1);
        assertThat(resultado.getEspecies().get(0).getNombre()).isEqualTo("Perro");
        verify(enfermedadRepository).save(any(Enfermedad.class));
    }

    @Test
    @DisplayName("Debe actualizar una enfermedad existente")
    void actualizarEnfermedadExito() {

        when(enfermedadRepository.findById(10L)).thenReturn(Optional.of(enfermedadExistente));
        when(especieRepository.findAllById(any())).thenReturn(Arrays.asList(especiePerro));
        when(enfermedadRepository.save(any(Enfermedad.class))).thenReturn(enfermedadExistente);


        EnfermedadDTO resultado = enfermedadService.actualizar(10L, requestDTO);


        assertThat(resultado.getNombre()).isEqualTo("Parvovirus");
        verify(enfermedadRepository).save(enfermedadExistente);
    }

    @Test
    @DisplayName("Debe lanzar excepción al intentar actualizar una enfermedad que no existe")
    void actualizarErrorNoEncontrado() {

        when(enfermedadRepository.findById(99L)).thenReturn(Optional.empty());


        assertThatThrownBy(() -> enfermedadService.actualizar(99L, requestDTO))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Enfermedad no encontrada");

        verify(enfermedadRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe llamar al repositorio para eliminar")
    void eliminarExito() {

        enfermedadService.eliminar(1L);


        verify(enfermedadRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Debe listar todas las enfermedades")
    void listarTodasExito() {

        when(enfermedadRepository.findAll()).thenReturn(Arrays.asList(new Enfermedad(), new Enfermedad()));


        List<Enfermedad> lista = enfermedadService.listarTodas();


        assertThat(lista).hasSize(2);
        verify(enfermedadRepository).findAll();
    }
}