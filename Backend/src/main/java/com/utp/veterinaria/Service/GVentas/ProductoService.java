package com.utp.veterinaria.Service.GVentas;

import com.utp.veterinaria.Model.GestionVentas.Producto;
import com.utp.veterinaria.Repository.GVentas.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private static final Logger logger = LoggerFactory.getLogger(ProductoService.class);

    private final ProductoRepository productoRepository;

    public List<Producto> listar() {
        logger.info("Productos Listados");
        return productoRepository.findAll().stream()
                .filter(Producto::isActivo)
                .toList();
    }

    public Producto guardar(Producto p) {
        logger.info("Producto Guardado");
        return productoRepository.save(p);
    }

    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        producto.setActivo(false);
        productoRepository.save(producto);
        logger.info("Producto desactivado: {}", id);
    }
}