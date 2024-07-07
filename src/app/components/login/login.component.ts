import { Component } from '@angular/core';
//Modificaciones "Importar FormBuilder y FormGroup"
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service'; //Para esta ejecutar priemro "ng generate service data"
/*Para expres los comandos son:
npm init -y
npm install express body-parser cors mysql2
y luego se crea el archivo server.js, para evitar errores en carpetas es mejor dejarlo fuera de alguna carpeta
*/
//Importar router para la redirección luego de un inicio de sesión exitosp
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Clave: Definimos loginForm como FormGroup
  loginForm: FormGroup;
  //mensaje
  responseMessage: string = '';
  isSuccess: boolean | null = null;

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    this.loginForm = this.fb.group({
      // Definimos nuestros parametros o atributos cómo string vacíos
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    // revisar si el formulario es válido
    if (this.loginForm.valid) {

      this.dataService.login(this.loginForm.value).subscribe({
        next: response => {
          //respuesta
          console.log('Data sent successfully', response);
          this.responseMessage = response.message;
          this.isSuccess = true;
          const email = this.loginForm.value.email; //Aquí extraemos el 'email'

          this.router.navigate(['/hotel-booking', email], {replaceUrl: true}); //ruta par redirigir luego del inicio de seción existoso
        },
        error: error => {
          // muestra un mensaje de error en consola
          console.error('Error sending data', error);
          this.responseMessage = error.error.error || 'Error al enviar los datos';
          this.isSuccess = false;

          // Mensaje de error visible por 5 segundos
          setTimeout(() => {
            this.responseMessage = '';
            this.isSuccess = null;
          }, 3000);
        }
      });
    }else {
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
