package com.utp.veterinaria.ServiceTest;

import com.utp.veterinaria.DTO.VentaRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Model.GestionVentas.Producto;
import com.utp.veterinaria.Model.GestionVentas.Venta;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GVentas.ProductoRepository;
import com.utp.veterinaria.Repository.GVentas.VentaRepository;
import com.utp.veterinaria.Service.GVentas.VentaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {

    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private ProductoRepository productoRepository;
    @Mock
    private VentaRepository ventaRepository;

    @InjectMocks
    private VentaService ventaService;

    private Cliente cliente;
    private Producto producto;

    @BeforeEach
    void setUp() {
        cliente = new Cliente();
        cliente.setId(1L);
        cliente.setNombres("Carlos");
        cliente.setApellidos("Pérez");

        producto = new Producto();
        producto.setId(100L);
        producto.setNombre("Vitaminas Caninas");
    }

    @Test
    @DisplayName("Debe realizar una venta con éxito calculando totales y asignando cliente")
    void realizarVentaDTOSuccess() {
        // 1. Mockeamos el DTO y el objeto interno de la lista detalles
        VentaRequestDTO dto = mock(VentaRequestDTO.class);
        // Usamos var o el tipo específico que use tu lista en el DTO
        var detalleItem = mock(VentaRequestDTO.DetalleDTO.class);

        // 2. Configuramos el comportamiento del detalle (Mocking del DTO de entrada)
        when(detalleItem.getProductoId()).thenReturn(100L);
        when(detalleItem.getNombreProducto()).thenReturn("Vitaminas Caninas");
        when(detalleItem.getPrecioUnitario()).thenReturn(50.0);
        when(detalleItem.getCantidad()).thenReturn(2);

        // 3. Configuramos el DTO principal
        when(dto.getClienteId()).thenReturn(1L);
        when(dto.getDetalles()).thenReturn(List.of(detalleItem));

        // 4. Mocking de Repositorios
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(productoRepository.findById(100L)).thenReturn(Optional.of(producto));
        when(ventaRepository.save(any(Venta.class))).thenAnswer(invocation -> {
            Venta v = invocation.getArgument(0);
            v.setId(500L); // Simular ID generado
            return v;
        });

        // --- Ejecución ---
        Venta resultado = ventaService.realizarVentaDTO(dto);

        // --- Verificaciones ---
        assertThat(resultado).isNotNull();
        assertThat(resultado.getCliente().getNombres()).isEqualTo("Carlos");
        assertThat(resultado.getEstado()).isEqualTo(Venta.Estadoventa.COMPLETADA);

        // Verificación de cálculos: 50.0 * 2 = 100.0
        assertThat(resultado.getTotal()).isEqualTo(100.0);
        assertThat(resultado.getDetalles()).hasSize(1);
        assertThat(resultado.getDetalles().get(0).getSubtotal()).isEqualTo(100.0);
        assertThat(resultado.getDetalles().get(0).getVenta()).isEqualTo(resultado);

        verify(ventaRepository, times(1)).save(any(Venta.class));
    }

    @Test
    @DisplayName("Debe lanzar excepción si el cliente no es encontrado")
    void realizarVentaClienteNoEncontrado() {
        // Arrange
        VentaRequestDTO dto = mock(VentaRequestDTO.class);
        when(dto.getClienteId()).thenReturn(99L);
        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> ventaService.realizarVentaDTO(dto))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Cliente no encontrado");

        verify(ventaRepository, never()).save(any());
    }

    @Test
    @DisplayName("Debe listar todas las ventas correctamente")
    void listarVentasTest() {
        // Arrange
        when(ventaRepository.findAll()).thenReturn(List.of(new Venta(), new Venta()));

        // Act
        List<Venta> lista = ventaService.listarVentas();

        // Assert
        assertThat(lista).hasSize(2);
        verify(ventaRepository).findAll();
    }
}