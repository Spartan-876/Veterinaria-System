import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  async generarBoletaVenta(venta: any): Promise<void> {
    const doc = new jsPDF();
    // Header
    doc.setFillColor(45, 106, 79); // verde #2d6a4f
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Huellitas Vet', 15, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Clínica Veterinaria', 15, 22);
    doc.text('Av. Sáenz Peña 580, Chiclayo, Perú', 15, 28);

    const logoUrl = 'https://lmuclkgmsvlusqgqbqyn.supabase.co/storage/v1/object/public/Peluche/logo.png';
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = logoUrl;

    await new Promise((resolve) => {
      img.onload = () => {
        let jsPDF1 = doc.addImage(img, 'PNG', 155, 5, 40, 25);
        resolve(null);
      };
      img.onerror = () => resolve(null);
    });


    doc.setTextColor(45, 106, 79);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('BOLETA DE VENTA', 105, 50, { align: 'center' });

    doc.setDrawColor(82, 183, 136);
    doc.setLineWidth(0.5);
    doc.line(15, 55, 195, 55);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const fecha = new Date(venta.fecha).toLocaleDateString('es-PE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    doc.text(`N° Pedido:`, 15, 65);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${String(venta.id).padStart(4, '0')}`, 50, 65);

    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha:`, 15, 72);
    doc.setFont('helvetica', 'bold');
    doc.text(fecha, 50, 72);

    doc.setFont('helvetica', 'normal');
    doc.text(`Estado:`, 15, 79);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 106, 79);
    doc.text(venta.estado, 50, 79);

    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`Cliente:`, 120, 65);
    doc.setFont('helvetica', 'bold');
    doc.text(`${venta.cliente.nombres}`, 145, 65);

    doc.setFont('helvetica', 'normal');
    doc.text(`${venta.cliente.apellidos}`, 145, 72);

    doc.setFont('helvetica', 'normal');
    doc.text(`Correo:`, 120, 80);
    doc.setFont('helvetica', 'bold');
    doc.text(venta.cliente?.correo || '-', 145, 80);

    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Detalle de productos', 15, 92);

    autoTable(doc, {
      startY: 96,
      head: [['Producto', 'Precio Unit.', 'Cantidad', 'Subtotal']],
      body: venta.detalles.map((d: any) => [
        d.nombreProducto,
        `S/ ${Number(d.precioUnitario).toFixed(2)}`,
        d.cantidad,
        `S/ ${Number(d.subtotal).toFixed(2)}`
      ]),
      headStyles: {
        fillColor: [45, 106, 79],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [240, 250, 244] },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { halign: 'right' },
        2: { halign: 'center' },
        3: { halign: 'right' }
      },
      margin: { left: 15, right: 15 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 8;

    doc.setDrawColor(82, 183, 136);
    doc.setLineWidth(0.3);
    doc.line(120, finalY, 195, finalY);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 106, 79);
    doc.text('TOTAL A PAGAR:', 120, finalY + 8);
    doc.setFontSize(14);
    doc.text(`S/ ${Number(venta.total).toFixed(2)}`, 195, finalY + 8, { align: 'right' });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('Gracias por confiar en Huellitas Vet', 105, 280, { align: 'center' });
    doc.text('cristianJ@huellitasvet.com  |  +51 999 999 999', 105, 285, { align: 'center' });

    doc.save(`boleta-${String(venta.id).padStart(4, '0')}.pdf`);
  }
}
