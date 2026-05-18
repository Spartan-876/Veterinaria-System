import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Login } from './components/login/login';
import { Dashboard } from './components/layout/dashboard/dashboard';
import { Clientes } from './components/layout/clientes/clientes';
import { Mascotas } from './components/layout/mascotas/mascotas';
import { Vacunas } from './components/layout/vacunas/vacunas';
import { Enfermedades } from './components/layout/enfermedades/enfermedades';
import { Trabajadores } from './components/layout/trabajadores/trabajadores';
import { Productos } from './components/layout/productos/productos';
import { Ventas } from './components/layout/ventas/ventas';
import { Citas } from './components/layout/citas/citas';
import { Servicios } from './components/layout/servicios/servicios';
import { Inicio } from './components/inicio/inicio';
import { authGuard} from './services/auth.guard';
import {PagosComponent} from './components/layout/pagos-component/pagos-component';
import {HorarioComponent} from './components/layout/horario-component/horario-component';
import { MisCompras } from './components/inicio/mis-compras/mis-compras';
import { clienteGuard} from './services/clienteGuard';
import {AgendarCita} from './components/inicio/agendar-cita/agendar-cita';
import {MisCitas} from './components/inicio/mis-citas/mis-citas';
import {MisMascotas} from './components/inicio/mis-mascotas/mis-mascotas';


export const routes: Routes = [
  { path: 'login', component: Login, data: { title: 'Iniciar Sesión' } },
  {
    path: 'inicio',
    component: Inicio,
    data: { title: 'Inicio' }
  },
  {
    path: 'mis-compras',
    component: MisCompras,
    canActivate: [clienteGuard],
    data: { title: 'Mis Compras' }
  },
  { path: 'agendar-cita', component: AgendarCita, canActivate: [clienteGuard] },
  { path: 'mis-citas',    component: MisCitas,    canActivate: [clienteGuard] },
  { path: 'mis-mascotas', component: MisMascotas, canActivate: [clienteGuard] },

  {
    path: 'admin',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard, data: { title: 'Dashboard' } },
      { path: 'clientes', component: Clientes, data: { title: 'Clientes' } },
      { path: 'mascotas', component: Mascotas, data: { title: 'Mascotas' } },
      { path: 'vacunas', component: Vacunas, data: { title: 'Vacunas' } },
      { path: 'pagos', component: PagosComponent, data: { title: 'Pagos' } },
      { path: 'horarios', component: HorarioComponent, data: { title: 'Horarios' } },
      { path: 'enfermedades', component: Enfermedades, data: { title: 'Enfermedades' } },
      { path: 'trabajadores', component: Trabajadores, data: { title: 'Trabajadores' } },
      { path: 'productos', component: Productos, data: { title: 'Productos' } },
      { path: 'ventas', component: Ventas, data: { title: 'Ventas' } },
      { path: 'citas', component: Citas, data: { title: 'Citas' } },
      { path: 'servicios', component: Servicios, data: { title: 'Servicios' } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];
