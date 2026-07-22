package com.utp.veterinaria.Service.GVentas;

import com.utp.veterinaria.DTO.VentaRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Model.GestionVentas.DetalleVenta;
import com.utp.veterinaria.Model.GestionVentas.Producto;
import com.utp.veterinaria.Model.GestionVentas.Venta;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GVentas.ProductoRepository;
import com.utp.veterinaria.Repository.GVentas.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VentaService {

    private final ClienteRepository clienteRepository;

    private final ProductoRepository productoRepository;

    private final VentaRepository ventaRepository;

    public List<Venta> listarPorCliente(Long clienteId) {
        return ventaRepository.findByClienteId(clienteId);
    }

    @Transactional
    public Venta realizarVentaDTO(VentaRequestDTO dto) {
        if (dto.getClienteId() == null) {
            throw new RuntimeException("El cliente es obligatorio");
        }
        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un detalle");
        }

        Venta venta = new Venta();
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        venta.setCliente(cliente);
        venta.setEstado(Venta.Estadoventa.PENDIENTE);

        List<DetalleVenta> detalles = dto.getDetalles().stream().map(d -> {
            if (d.getCantidad() == null || d.getCantidad() <= 0) {
                throw new RuntimeException("La cantidad debe ser mayor a 0 para: " + d.getNombreProducto());
            }
            if (d.getPrecioUnitario() == null || d.getPrecioUnitario() < 0) {
                throw new RuntimeException("El precio unitario no puede ser negativo para: " + d.getNombreProducto());
            }

            DetalleVenta det = new DetalleVenta();
            det.setNombreProducto(d.getNombreProducto());
            det.setPrecioUnitario(d.getPrecioUnitario());
            det.setCantidad(d.getCantidad());
            det.setSubtotal(d.getPrecioUnitario() * d.getCantidad());
            det.setVenta(venta);

            if (d.getProductoId() != null) {
                Producto producto = productoRepository.findById(d.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado: ID " + d.getProductoId()));
                if (producto.getStock() < d.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para: " + producto.getNombre()
                            + ". Disponible: " + producto.getStock() + ", solicitado: " + d.getCantidad());
                }
                producto.setStock(producto.getStock() - d.getCantidad());
                productoRepository.save(producto);
                det.setProducto(producto);
            }
            return det;
        }).collect(Collectors.toList());

        venta.setDetalles(detalles);
        venta.setTotal(detalles.stream().mapToDouble(DetalleVenta::getSubtotal).sum());
        return ventaRepository.save(venta);
    }

    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

}