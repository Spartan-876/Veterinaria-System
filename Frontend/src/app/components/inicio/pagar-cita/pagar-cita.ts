import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CitasService } from '../../../services/citas-service';
import { PdfService } from '../../../services/pdf-service';
import { Cita } from '../../../models/cita';
import { GToast } from '../../../services/gtoast';

@Component({
  selector: 'app-pagar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RadioButtonModule],
  templateUrl: './pagar-cita.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagarCita implements OnInit {
  cita: Cita | null = null;
  cargando = true;
  metodoPagoSel = 'EFECTIVO';
  readonly metodosPago = ['EFECTIVO', 'TARJETA', 'YAPE', 'PLIN'];
  pagando = false;
  pagoExitoso = false;
  private citaId = 0;

  constructor(
    private route: ActivatedRoute,
    private citaService: CitasService,
    private pdfService: PdfService,
    private toast: GToast,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.citaId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.citaId) {
      this.toast.error('Cita no encontrada');
      return;
    }

    const clienteId = Number(localStorage.getItem('clienteId'));
    if (!clienteId) return;

    this.citaService.listarPorCliente(clienteId).subscribe({
      next: (citas) => {
        this.cita = citas.find(c => c.id === this.citaId) ?? null;
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  pagar(): void {
    if (!this.cita || !this.cita.precioServicio) return;
    this.pagando = true;
    this.cdr.markForCheck();

    this.citaService.pagarCitaCliente(this.cita.id!, this.metodoPagoSel, this.cita.precioServicio).subscribe({
      next: (citaActualizada) => {
        this.cita = citaActualizada;
        this.pagoExitoso = true;
        this.pagando = false;
        this.toast.success('Pago registrado correctamente');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.pagando = false;
        this.toast.error(err.error?.message ?? 'Error al registrar el pago');
        this.cdr.markForCheck();
      }
    });
  }

  descargarBoleta(): void {
    if (this.cita) {
      this.pdfService.generarBoletaCita(this.cita);
    }
  }

  get metodoIcon(): string {
    const icons: Record<string, string> = {
      EFECTIVO: 'pi-wallet',
      TARJETA: 'pi-credit-card',
      YAPE: 'pi-mobile',
      PLIN: 'pi-send'
    };
    return icons[this.metodoPagoSel] ?? 'pi-dollar';
  }
}
