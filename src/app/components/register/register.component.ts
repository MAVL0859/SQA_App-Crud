import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  responseMessage: string = '';
  isSuccess: boolean | null = null;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    // Crear el formulario de registro con validaciones
    this.registerForm = this.fb.group({
      name: ['', Validators.required], // Campo obligatorio para el nombre
      lastname: ['', Validators.required], // Campo obligatorio para el apellido
      email: ['', [Validators.required, Validators.email]], // Campo obligatorio para el correo electrónico con validación de formato
      password: ['', Validators.required], // Campo obligatorio para la contraseña
      phonenumber: [''] // Campo opcional para el número de teléfono
    });
  }

  /**
   * Maneja el envío del formulario de registro.
   */
  onSubmit() {
    if (this.registerForm.valid) {
      // Si el formulario es válido, enviar los datos al servicio de registro
      this.dataService.register(this.registerForm.value).subscribe({
        next: response => {
          console.log('Registro de la cuenta exitoso', response);
          this.responseMessage = response.message; // Mensaje de respuesta del servidor
          this.isSuccess = true; // Indicador de éxito

          // Redirigir al usuario a la página de inicio de sesión después de 2 segundos
          setTimeout(() => {
            this.responseMessage = '';
            this.isSuccess = null;
            this.registerForm.reset();
            this.router.navigate(['./login'], { replaceUrl: true });
          }, 2000);
        },
        error: error => {
          console.error('Error al enviar datos', error);

          // Manejar el caso donde el correo electrónico ya está registrado
          if (error.status === 400 && error.error.error === 'El correo electrónico ya está registrado') {
            this.responseMessage = 'El correo electrónico ya está registrado';
          } else {
            this.responseMessage = 'Error al enviar los datos';
          }

          this.isSuccess = false; // Indicador de error

          // Limpiar el mensaje de respuesta después de 5 segundos
          setTimeout(() => {
            this.responseMessage = '';
            this.isSuccess = null;
          }, 5000);
        }
      });
    } else {
      // Si el formulario no es válido, marcar todos los campos como tocados y mostrar un mensaje de error
      this.registerForm.markAllAsTouched();
      this.responseMessage = 'Completar todos los campos';
      this.isSuccess = false;

      // Limpiar el mensaje de respuesta después de 3 segundos
      setTimeout(() => {
        this.responseMessage = '';
        this.isSuccess = null;
      }, 3000);
    }
  }
}
