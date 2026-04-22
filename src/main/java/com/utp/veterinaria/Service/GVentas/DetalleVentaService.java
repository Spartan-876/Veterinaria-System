package com.utp.veterinaria.Service.GVentas;

import com.example.vet.Model.GestionVentas.DetalleVenta;
import com.example.vet.Repository.GVentas.DetalleVentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;


    public List<DetalleVenta> listarTodos() {
        return detalleVentaRepository.findAll();
    }

    public DetalleVenta guardar(DetalleVenta detalle) {
        // Lógica de negocio: Calcular subtotal antes de guardar si es necesario
        if (detalle.getPrecioUnitario() != null && detalle.getCantidad() != null) {
            detalle.setSubtotal(detalle.getPrecioUnitario() * detalle.getCantidad());
        }
        return detalleVentaRepository.save(detalle);
    }

    public List<DetalleVenta> buscarPorVenta(Long ventaId) {
        return detalleVentaRepository.findByVentaId(ventaId);
    }
}