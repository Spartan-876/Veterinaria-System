package com.utp.veterinaria.Service.GVentas;

import com.example.vet.DTO.VentaRequestDTO;
import com.example.vet.Model.GestionUsuarios.Cliente;
import com.example.vet.Model.GestionVentas.DetalleVenta;
import com.example.vet.Model.GestionVentas.Venta;
import com.example.vet.Repository.GUsuarios.ClienteRepository;
import com.example.vet.Repository.GVentas.ProductoRepository;
import com.example.vet.Repository.GVentas.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public Venta realizarVentaDTO(VentaRequestDTO dto) {
        Venta venta = new Venta();
        Cliente cliente = clienteRepository.findById(dto.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        venta.setCliente(cliente);
        venta.setEstado(Venta.Estadoventa.COMPLETADA);

        List<DetalleVenta> detalles = dto.getDetalles().stream().map(d -> {
            DetalleVenta det = new DetalleVenta();
            det.setNombreProducto(d.getNombreProducto());
            det.setPrecioUnitario(d.getPrecioUnitario());
            det.setCantidad(d.getCantidad());
            det.setSubtotal(d.getPrecioUnitario() * d.getCantidad());
            det.setVenta(venta);
            if (d.getProductoId() != null) {
                productoRepository.findById(d.getProductoId())
                        .ifPresent(det::setProducto);
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