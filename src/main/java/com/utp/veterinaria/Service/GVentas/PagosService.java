package com.utp.veterinaria.Service.GVentas;

import com.example.vet.DTO.PagosResumenDTO;
import com.example.vet.Model.GestionUsuarios.Cita;
import com.example.vet.Model.GestionVentas.Venta;
import com.example.vet.Repository.GUsuarios.CitaRepository;
import com.example.vet.Repository.GVentas.VentaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PagosService {

    private final VentaRepository ventaRepository;
    private final CitaRepository citaRepository;

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
