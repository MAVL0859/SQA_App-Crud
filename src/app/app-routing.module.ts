import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HotelBookingComponent } from './components/hotel-booking/hotel-booking.component';

/**
 * Define las rutas de la aplicación.
 */
const routes: Routes = [
  {
    path: 'login', component: LoginComponent // Ruta para el componente de inicio de sesión
  },
  {
    path: 'register', component: RegisterComponent // Ruta para el componente de registro de usuarios
  },
  {
    path: 'hotel-booking/:email', component: HotelBookingComponent // Ruta para el componente de reserva de hoteles con un parámetro de correo electrónico
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full' // Redirigir a la ruta de inicio de sesión si la ruta está vacía
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Importar las rutas en el módulo raíz
  exports: [RouterModule] // Exportar RouterModule para que esté disponible en toda la aplicación
})
export class AppRoutingModule { }
