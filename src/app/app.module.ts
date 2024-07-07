import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importar provideHttpClient porque HttpClientModule en Angular 18 está en desuso

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HotelBookingComponent } from './components/hotel-booking/hotel-booking.component';

// Importar FontAwesome
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent, // Componente principal de la aplicación
    LoginComponent, // Componente para el inicio de sesión
    RegisterComponent, // Componente para el registro de usuarios
    HotelBookingComponent // Componente para la reserva de hoteles
  ],
  imports: [
    BrowserModule,
    FormsModule, // Módulo necesario para que la aplicación funcione en un navegador
    ReactiveFormsModule, // Módulo para manejar formularios reactivos
    AppRoutingModule, // Módulo para el enrutamiento de la aplicación
    FontAwesomeModule, // Módulo para utilizar iconos de FontAwesome
    BrowserAnimationsModule, // Módulo para soportar animaciones en el navegador
    ToastrModule.forRoot() // Módulo para mostrar notificaciones tipo toast
  ],
  providers: [
    provideHttpClient(withFetch()) // Proveedor para manejar solicitudes HTTP, utilizando provideHttpClient() ya que HttpClientModule está en desuso en Angular 18
  ],
  bootstrap: [AppComponent] // Componente principal que se va a cargar al iniciar la aplicación
})
export class AppModule { }
