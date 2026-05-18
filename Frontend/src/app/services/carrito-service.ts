// services/carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrito } from '../models/carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);
  items$ = this.itemsSubject.asObservable();

  get items(): ItemCarrito[] {
    return this.itemsSubject.value;
  }

  get total(): number {
    return this.items.reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0);
  }

  get cantidad(): number {
    return this.items.reduce((acc, i) => acc + i.cantidad, 0);
  }

  agregar(item: ItemCarrito): void {
    const actual = [...this.items];
    const idx = actual.findIndex(i => i.productoId === item.productoId);
    if (idx >= 0) {
      actual[idx] = { ...actual[idx], cantidad: actual[idx].cantidad + item.cantidad };
    } else {
      actual.push(item);
    }
    this.itemsSubject.next(actual);
  }

  incrementar(productoId: number): void {
    const actual = this.items.map(i =>
      i.productoId === productoId ? { ...i, cantidad: i.cantidad + 1 } : i
    );
    this.itemsSubject.next(actual);
  }

  decrementar(productoId: number): void {
    const actual = this.items
      .map(i => i.productoId === productoId ? { ...i, cantidad: i.cantidad - 1 } : i)
      .filter(i => i.cantidad > 0);
    this.itemsSubject.next(actual);
  }

  eliminar(productoId: number): void {
    this.itemsSubject.next(this.items.filter(i => i.productoId !== productoId));
  }

  limpiar(): void {
    this.itemsSubject.next([]);
  }
}
