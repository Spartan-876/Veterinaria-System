package com.utp.veterinaria.Service.GVentas;

import com.utp.veterinaria.DTO.PagosResumenDTO;
import com.utp.veterinaria.DTO.PagoRequestDTO;
import com.utp.veterinaria.Model.GestionUsuarios.Cita;
import com.utp.veterinaria.Model.GestionVentas.Pago;
import com.utp.veterinaria.Model.GestionVentas.Venta;
import com.utp.veterinaria.Repository.GUsuarios.CitaRepository;
import com.utp.veterinaria.Repository.GVentas.PagoRepository;
import com.utp.veterinaria.Repository.GVentas.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagosService {

    private final VentaRepository ventaRepository;
    private final CitaRepository citaRepository;
    private final PagoRepository pagoRepository;

    @Transactional
    public Pago registrarPago(PagoRequestDTO dto) {
        if (dto.getVentaId() == null && dto.getCitaId() == null) {
            throw new RuntimeException("Debe especificar una venta o una cita");
        }
        if (dto.getMonto() == null || dto.getMonto() <= 0) {
            throw new RuntimeException("El monto debe ser mayor a 0");
        }

        Pago pago = new Pago();
        pago.setMonto(dto.getMonto());
        pago.setMetodoPago(dto.getMetodoPago());
        pago.setComentario(dto.getComentario());

        if (dto.getVentaId() != null) {
            Venta venta = ventaRepository.findById(dto.getVentaId())
                    .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
            pago.setVenta(venta);
            venta.setEstado(Venta.Estadoventa.COMPLETADA);
            venta.setMetodoPago(dto.getMetodoPago());
            ventaRepository.save(venta);
        }

        if (dto.getCitaId() != null) {
            Cita cita = citaRepository.findById(dto.getCitaId())
                    .orElseThrow(() -> new RuntimeException("Cita no encontrada"));
            pago.setCita(cita);
        }

        return pagoRepository.save(pago);
    }

    public List<Pago> listarPorVenta(Long ventaId) {
        return pagoRepository.findByVentaId(ventaId);
    }

    public List<Pago> listarPorCita(Long citaId) {
        return pagoRepository.findByCitaId(citaId);
    }

    public PagosResumenDTO getResumen() {
        PagosResumenDTO dto = new PagosResumenDTO();
        LocalDateTime ahora = LocalDateTime.now();
        LocalDateTime inicioMes = ahora.withDayOfMonth(1).withHour(0).withMinute(0);

        List<Cita> citasRealizadas = citaRepository.findAll().stream()
                .filter(c -> c.getEstado() == Cita.EstadoCita.REALIZADA
                        && c.getServicio() != null)
                .toList();

        double totalCitas = citasRealizadas.stream()
                .mapToDouble(c -> c.getServicio().getPrecio()).sum();

        double citasMes = citasRealizadas.stream()
                .filter(c -> c.getFechaHora().isAfter(inicioMes))
                .mapToDouble(c -> c.getServicio().getPrecio()).sum();

        long pendientesCobro = citaRepository.findAll().stream()
                .filter(c -> c.getEstado() == Cita.EstadoCita.PENDIENTE
                        || c.getEstado() == Cita.EstadoCita.CONFIRMADA)
                .count();

        List<Venta> ventasCompletadas = ventaRepository.findAll().stream()
                .filter(v -> v.getEstado() == Venta.Estadoventa.COMPLETADA)
                .toList();

        double totalProductos = ventasCompletadas.stream()
                .mapToDouble(Venta::getTotal).sum();

        double productosMes = ventasCompletadas.stream()
                .filter(v -> v.getFecha().isAfter(inicioMes))
                .mapToDouble(Venta::getTotal).sum();

        dto.setIngresosCitas(totalCitas);
        dto.setIngresosProductos(totalProductos);
        dto.setIngresosTotales(totalCitas + totalProductos);
        dto.setIngresosCitasMes(citasMes);
        dto.setIngresosProductosMes(productosMes);
        dto.setIngresosMesActual(citasMes + productosMes);
        dto.setTotalVentas((long) ventasCompletadas.size());
        dto.setTotalCitasRealizadas((long) citasRealizadas.size());
        dto.setCitasPendientesCobro(pendientesCobro);

        dto.setPorMes(calcularUltimosMeses(citasRealizadas, ventasCompletadas));

        return dto;
    }

    private List<PagosResumenDTO.ResumenMes> calcularUltimosMeses(
            List<Cita> citas, List<Venta> ventas) {

        String[] meses = {"Ene","Feb","Mar","Abr","May","Jun",
                "Jul","Ago","Sep","Oct","Nov","Dic"};
        List<PagosResumenDTO.ResumenMes> resultado = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            LocalDateTime ref = LocalDateTime.now().minusMonths(i);
            int mes = ref.getMonthValue();
            int anio = ref.getYear();

            double c = citas.stream()
                    .filter(x -> x.getFechaHora().getMonthValue() == mes
                            && x.getFechaHora().getYear() == anio)
                    .mapToDouble(x -> x.getServicio().getPrecio()).sum();

            double p = ventas.stream()
                    .filter(x -> x.getFecha().getMonthValue() == mes
                            && x.getFecha().getYear() == anio)
                    .mapToDouble(Venta::getTotal).sum();

            resultado.add(new PagosResumenDTO.ResumenMes(meses[mes - 1], c, p));
        }
        return resultado;
    }
}
