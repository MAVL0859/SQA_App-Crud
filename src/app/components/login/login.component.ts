import { Component } from '@angular/core';
// Importar FormBuilder y FormGroup para la creación y gestión de formularios reactivos
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importar el servicio de datos para manejar las solicitudes HTTP relacionadas con el usuario
import { DataService } from '../../services/data.service';
// Importar Router para la redirección luego de un inicio de sesión exitoso
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Definir loginForm como un FormGroup
  loginForm: FormGroup;
  // Mensaje de respuesta para mostrar mensajes de éxito o error
  responseMessage: string = '';
  // Indicador de éxito o error en la respuesta
  isSuccess: boolean | null = null;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    // Crear el formulario de inicio de sesión con validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Campo obligatorio para el correo electrónico con validación de formato
      password: ['', Validators.required] // Campo obligatorio para la contraseña
    });
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   */
  onSubmit() {
    // Revisar si el formulario es válido
    if (this.loginForm.valid) {
      // Si el formulario es válido, enviar los datos al servicio de inicio de sesión
      this.dataService.login(this.loginForm.value).subscribe({
        next: response => {
          // Respuesta exitosa
          console.log('Datos enviados exitosamente', response);
          this.responseMessage = response.message;
          this.isSuccess = true;
          const email = this.loginForm.value.email; // Extraer el correo electrónico del formulario

          // Redirigir al usuario a la página de reservas de hotel después de un inicio de sesión exitoso
          this.router.navigate(['/hotel-booking', email], { replaceUrl: true });
        },
        error: error => {
          // Mostrar un mensaje de error en consola
          console.error('Error al enviar datos', error);
          this.responseMessage = error.error.error || 'Error al enviar los datos';
          this.isSuccess = false;

          // Mensaje de error visible por 3 segundos
          setTimeout(() => {
            this.responseMessage = '';
            this.isSuccess = null;
          }, 3000);
        }
      });
    } else {
      // Marcar los campos como tocados para mostrar errores si están vacíos
      this.loginForm.markAllAsTouched();
      this.responseMessage = 'Por favor, completa todos los campos requeridos.';
      this.isSuccess = false;

      // Mensaje de campos requeridos visible por 3 segundos
      setTimeout(() => {
        this.responseMessage = '';
        this.isSuccess = null;
      }, 3000);
    }
  }
}



/*Revisar:
1.  usar la biblioteca Google Identity Services. (consola de Google Cloud)
2. Configuración en Facebook Developers
3. Configuración en Apple Developer*/
/*
export class LoginComponent {
  loginWithGoogle() {
    //lógica para el inicio de sesión con Google
    alert("Inicio de sesión con Google");
  }

  loginWithFacebook() {
    //lógica para el inicio de sesión con Facebook
    alert("Inicio de sesión con Facebook");
  }

  loginWithApple() {
    //lógica para el inicio de sesión con Apple (Esta solo es para probar, ya que es más compleja)
    alert("Inicio de sesión con Apple");
  }
} */
