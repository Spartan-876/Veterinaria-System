import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Login } from './components/login/login';
import { Dashboard } from './components/layout/dashboard/dashboard';
import { Clientes } from './components/layout/clientes/clientes';
import { Mascotas } from './components/layout/mascotas/mascotas';
import { Vacunas } from './components/layout/vacunas/vacunas';
import { Enfermedades } from './components/layout/enfermedades/enfermedades';
import { Trabajadores } from './components/layout/trabajadores/trabajadores';
import { Productos as ProductosAdmin } from './components/layout/productos/productos';
import { Ventas } from './components/layout/ventas/ventas';
import { Histventas } from './components/layout/histventas/histventas';
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
import {PagarCita} from './components/inicio/pagar-cita/pagar-cita';
import {Roles} from './components/layout/roles/roles';
import {Usuarios} from './components/layout/usuarios/usuarios';
import { RedirectToFirst } from './components/redirect-to-first';
import { Agenda } from './components/layout/agenda/agenda';
import { Reportes } from './components/layout/reportes/reportes';
import { SobreNosotrosPage } from './components/inicio/pages/sobre-nosotros';
import { ServiciosPage } from './components/inicio/pages/servicios-page';
import { ProductosPage } from './components/inicio/pages/productos-page';
import { OpinionesPage } from './components/inicio/pages/opiniones-page';
import { FAQPage } from './components/inicio/pages/faq-page';
import { ContactoPage } from './components/inicio/pages/contacto-page';

export const routes: Routes = [
  { path: 'login', component: Login, data: { title: 'Iniciar Sesión' } },
  {
    path: 'inicio',
    component: Inicio,
    data: { title: 'Inicio' }
  },
  { path: 'sobre-nosotros', component: SobreNosotrosPage, data: { title: 'Sobre Nosotros' } },
  { path: 'servicios', component: ServiciosPage, data: { title: 'Servicios' } },
  { path: 'productos', component: ProductosPage, data: { title: 'Productos' } },
  { path: 'opiniones', component: OpinionesPage, data: { title: 'Opiniones' } },
  { path: 'faq', component: FAQPage, data: { title: 'Preguntas Frecuentes' } },
  { path: 'contacto', component: ContactoPage, data: { title: 'Contacto' } },
  {
    path: 'mis-compras',
    component: MisCompras,
    canActivate: [clienteGuard],
    data: { title: 'Mis Compras' }
  },
  { path: 'agendar-cit', component: AgendarCita, canActivate: [clienteGuard] },
  { path: 'mis-citas',    component: MisCitas,    canActivate: [clienteGuard] },
  { path: 'pagar-cita/:id', component: PagarCita, canActivate: [clienteGuard] },
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
      { path: 'agenda', component: Agenda, data: { title: 'Mi Agenda' } },
      { path: 'enfermedades', component: Enfermedades, data: { title: 'Enfermedades' } },
      { path: 'trabajadores', component: Trabajadores, data: { title: 'Trabajadores' } },
      { path: 'productos', component: ProductosAdmin, data: { title: 'Productos' } },
      { path: 'ventas', component: Ventas, data: { title: 'Nueva Venta' } },
      { path: 'histventas', component: Histventas, data: { title: 'Historial de Ventas' } },
      { path: 'citas', component: Citas, data: { title: 'Citas' } },
      { path: 'servicios', component: Servicios, data: { title: 'Servicios' } },
      { path: 'roles', component: Roles, data: { title: 'Roles' } },
      { path: 'usuarios', component: Usuarios, data: { title: 'Usuarios' } },
      { path: 'reportes', component: Reportes, data: { title: 'Reportes' } },
      { path: '', component: RedirectToFirst }
    ]
  },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];
