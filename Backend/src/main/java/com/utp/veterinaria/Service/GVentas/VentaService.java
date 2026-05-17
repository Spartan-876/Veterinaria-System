package com.utp.veterinaria.Service.GVentas;

import com.utp.veterinaria.DTO.VentaRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cliente;
import com.utp.veterinaria.Model.GestionVentas.DetalleVenta;
import com.utp.veterinaria.Model.GestionVentas.Venta;
import com.utp.veterinaria.Repository.GUsuarios.ClienteRepository;
import com.utp.veterinaria.Repository.GVentas.ProductoRepository;
import com.utp.veterinaria.Repository.GVentas.VentaRepository;
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