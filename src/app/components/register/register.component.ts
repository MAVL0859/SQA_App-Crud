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
    this.registerForm = this.fb.group({
      name:['', Validators.required],
      lastname:['', Validators.required],
      email:['', Validators.required],
      password:['',Validators.required],
      phonenumber:['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.dataService.register(this.registerForm.value).subscribe({
        next: response => {
          console.log('Registro de la cuenta éxitoso', response);
          this.responseMessage = response.message;
          this.isSuccess = true;

          setTimeout(() => {
            this.responseMessage = '';
            this.isSuccess = null;
            this.registerForm.reset();
            this.router.navigate(['./login'], {replaceUrl: true});
          }, 2000);
        },
        error: error => {
          console.error('Error al enviar datos', error);

          // Maneja el caso donde el correo electrónico ya está registrado
          if (error.status === 400 && error.error.error === 'El correo electrónico ya está registrado') {
            this.responseMessage = 'El correo electrónico ya está registrado';
          } else {
            this.responseMessage = 'Error al enviar los datos';
          }

          this.isSuccess = false;

          setTimeout(() => {
            this.responseMessage = '';
            this.isSuccess = null;
          }, 5000);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.responseMessage = 'Completar todos los campos';
      this.isSuccess = false;

      setTimeout(() => {
        this.responseMessage = '';
        this.isSuccess = null;
      }, 3000);
    }
  }
}


