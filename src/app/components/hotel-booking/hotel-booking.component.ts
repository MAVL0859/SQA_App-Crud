import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.css']
})
export class HotelBookingComponent implements OnInit {
  // Correo electrónico del usuario
  userEmail: string = '';
  // Formulario para mostrar los detalles del usuario
  userDetailsForm: FormGroup;
  // Formulario para editar los detalles del usuario
  editUserForm: FormGroup;
  // Lista
  tasks: any[] = [];
  newTask: any = { title: '', description: '' };
  editedTask: any = null;
  editingTaskId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    // Inicializar los formularios con sus respectivos campos y validaciones
    this.userDetailsForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      lastname: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phonenumber: [{ value: '', disabled: true }]
    });

    this.editUserForm = this.fb.group({
      name: [''],
      lastname: [''],
      email: [{ value: '', disabled: true }],
      phonenumber: ['']
    });
  }

  ngOnInit(): void {
    // Obtener el correo electrónico del usuario desde los parámetros de la ruta
    this.userEmail = this.route.snapshot.paramMap.get('email') ?? '';

    this.loadTasks();

    // Para obtener solo la parte antes del @
    if (this.userEmail) {
      this.userEmail = this.userEmail.split('@')[0];
    }

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      this.userEmail = '';
    }, 5000);
  }

  loadTasks(): void {
    this.dataService.getTasks(this.userEmail).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (error) => {
        console.error('Error al obtener las tareas:', error);
      }
    });
  }

  addTask(): void {
    // Validar que los campos no estén vacíos antes de agregar la tarea
    if (this.newTask.title.trim() === '' || this.newTask.description.trim() === '') {
      console.warn('Los campos de título y descripción no pueden estar vacíos.');
      this.showNotification('Por favor completa los campos de título y descripción.', 'error');
      return;
    }

    this.dataService.createTask(this.userEmail, this.newTask).subscribe({
      next: () => {
        this.loadTasks();
        this.newTask = { title: '', description: '' };
      },
      error: error => console.error('Error al crear la tarea:', error)
    });
  }

  editTask(task: any): void {
    this.editedTask = { ...task }; // Copia la tarea para edición
    this.editingTaskId = task.id; // Establece el ID de la tarea en edición
  }

  cancelEdit(): void {
    this.editedTask = null; // Reinicia la tarea editada
    this.editingTaskId = null; // Reinicia el ID de la tarea en edición
  }

  updateTask(): void {
    if (this.editedTask) {
      const { id, title, description } = this.editedTask;
      this.dataService.updateTask(id, { title, description }).subscribe({
        next: () => {
          console.log('Tarea actualizada correctamente.');
          this.loadTasks();
          this.editedTask = null;
          this.editingTaskId = null;
        },
        error: error => {
          console.error('Error al actualizar la tarea:', error);
        }
      });
    } else {
      console.warn('No hay tarea seleccionada para actualizar.');
    }
  }

  deleteTask(id: number): void {
    this.dataService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (error) => {
        console.error('Error al eliminar la tarea:', error);
      }
    });
  }

  // Método para abrir el modal de confirmación de eliminación de cuenta
  openDeleteModal() {
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');
      const modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(modalBackdrop);
    }
  }

  // Método para cerrar el modal de confirmación de eliminación de cuenta
  closeDeleteModal() {
    const modal = document.getElementById('confirmDeleteModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
    }
  }

  // Método para mostrar una notificación
  showNotification(message: string, type: 'success' | 'error') {
    const notificationContainer = document.getElementById('notificationContainer');
    if (notificationContainer) {
      const notification = document.createElement('div');
      notification.className = `alert alert-${type} alert-dismissible fade show`;
      notification.style.minWidth = '200px';
      notification.innerText = message;

      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'btn-close';
      closeButton.setAttribute('data-bs-dismiss', 'alert');
      closeButton.setAttribute('aria-label', 'Close');

      notification.appendChild(closeButton);
      notificationContainer.appendChild(notification);

      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          notificationContainer.removeChild(notification);
        }, 150); // Tiempo para que la animación de desvanecimiento termine
      }, 3000); // Duración de la notificación
    }
  }

  // Método para eliminar una cuenta
  deleteAccount() {
    const email = this.route.snapshot.paramMap.get('email');

    if (email) {
      this.dataService.deleteAccount(email).subscribe({
        next: response => {
          console.log('Cuenta eliminada correctamente', response);
          this.closeDeleteModal();
          this.showNotification('Cuenta eliminada correctamente', 'success');
          this.clearUserData();
          setTimeout(() => {
            this.router.navigate(['/login'], { replaceUrl: true });
          }, 2000);
        },
        error: error => {
          console.error('Error al eliminar la cuenta', error);
          this.closeDeleteModal();
          this.showNotification('Error al eliminar la cuenta', 'error');
        }
      });
    }
  }

  // Método para cancelar la eliminación de cuenta
  cancelDelete() {
    this.closeDeleteModal();
  }

  // Método para abrir el modal de detalles del usuario
  openUserDetailsModal() {
    const email = this.route.snapshot.paramMap.get('email');

    if (email) {
      this.dataService.getUserDetails(email).subscribe({
        next: userDetails => {
          this.userDetailsForm.setValue({
            name: userDetails.name,
            lastname: userDetails.lastname,
            email: userDetails.email,
            phonenumber: userDetails.phonenumber
          });
          this.editUserForm.setValue({
            name: userDetails.name,
            lastname: userDetails.lastname,
            email: userDetails.email,
            phonenumber: userDetails.phonenumber
          });

          const modal = document.getElementById('userDetailsModal');
          if (modal) {
            modal.style.display = 'block';
            modal.classList.add('show');
            modal.removeAttribute('aria-hidden');
            modal.setAttribute('aria-modal', 'true');
            modal.setAttribute('role', 'dialog');
            const modalBackdrop = document.createElement('div');
            modalBackdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(modalBackdrop);
          }
        },
        error: error => {
          console.error('Error al obtener los datos del usuario', error);
          this.showNotification('Error al obtener los datos del usuario', 'error');
        }
      });
    }
  }

  // Método para cerrar el modal de detalles del usuario
  closeUserDetailsModal() {
    const modal = document.getElementById('userDetailsModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
    }
  }

  // Método para abrir el modal de edición del usuario
  openEditUserModal() {
    this.closeUserDetailsModal();

    const modal = document.getElementById('editUserModal');
    if (modal) {
      modal.style.display = 'block';
      modal.classList.add('show');
      modal.removeAttribute('aria-hidden');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('role', 'dialog');
      const modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(modalBackdrop);
    }
  }

  // Método para cerrar el modal de edición del usuario
  closeEditUserModal() {
    const modal = document.getElementById('editUserModal');
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.removeAttribute('role');
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        document.body.removeChild(modalBackdrop);
      }
    }
  }

  // Método para actualizar los datos del usuario
  updateUser() {
    const formData = {
      name: this.editUserForm.get('name')?.value,
      lastname: this.editUserForm.get('lastname')?.value,
      email: this.editUserForm.get('email')?.value,
      phonenumber: this.editUserForm.get('phonenumber')?.value
    };

    this.dataService.updateUser(formData).subscribe({
      next: response => {
        console.log('Datos del usuario actualizados correctamente', response);
        this.closeEditUserModal();
        this.showNotification('Datos actualizados correctamente', 'success');
      },
      error: error => {
        console.error('Error al actualizar los datos del usuario', error);
        this.closeEditUserModal();
        this.showNotification('Error al actualizar los datos', 'error');
      }
    });
  }

  // Método para limpiar los datos del usuario
  clearUserData() {
    this.userDetailsForm.reset();
    this.editUserForm.reset();
  }

  // Método para cerrar sesión
  logout() {
    this.dataService.logout().subscribe({
      next: response => {
        console.log('Sesión cerrada correctamente', response);
        this.showNotification('Cerrando sesión', 'success');
        this.clearUserData();
        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        }, 2000);
      },
      error: error => {
        console.error('Error al cerrar sesión', error);
        this.showNotification('Error al cerrar sesión', 'error');
      }
    });
  }
}

