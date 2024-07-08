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
  // Tarea actualmente editada
  newTask: any = { title: '', description: '' };
  editedTask: any = null;
  // ID de la tarea en edición
  editingTaskId: number | null = null;

  /**
   * Constructor de la clase HotelBookingComponent.
   *
   * @param route - El enrutador activado actualmente.
   * @param router - El enrutador utilizado para la navegación.
   * @param dataService - El servicio de datos utilizado para obtener los detalles del usuario.
   * @param fb - El constructor de formularios utilizado para crear los formularios.
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private fb: FormBuilder
  ) {
    // Inicializa los formularios con sus respectivos campos y validaciones
    this.userDetailsForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      lastname: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      phonenumber: [{ value: '', disabled: true }]
    });

    // Inicializa los formularios para la edición, el email se desabilita para no permitir la edición en aquel campo
    this.editUserForm = this.fb.group({
      name: [''],
      lastname: [''],
      email: [{ value: '', disabled: true }],
      phonenumber: ['']
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta después de que se haya inicializado el componente.
   * Se utiliza para realizar tareas de inicialización, como obtener el correo electrónico del usuario y cargar las tareas.
   */
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

  /**
   * Carga las tareas del usuario actual.
   */
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

  /**
   * Agrega una tarea.
   *
   * Valida que los campos no estén vacíos antes de agregar la tarea. Si alguno de los campos está vacío,
   * muestra una notificación de error y no agrega la tarea.
   *
   * Luego, utiliza el servicio de datos para crear la tarea asociada al usuario actual. Si la tarea se crea
   * correctamente, se recarga la lista de tareas y se reinicia el formulario de nueva tarea.
   *
   * @returns void
   */
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

  /**
   * Edita una tarea.
   *
   * @param task La tarea a editar.
   */
  editTask(task: any): void {
    this.editedTask = { ...task }; // Copia la tarea para edición
    this.editingTaskId = task.id; // Establece el ID de la tarea en edición
  }

  /**
   * Cancela la edición de la tarea.
   */
  cancelEdit(): void {
    this.editedTask = null; // Reinicia la tarea editada
    this.editingTaskId = null; // Reinicia el ID de la tarea en edición
  }

  /**
   * Actualiza la tarea seleccionada.
   */
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

  /**
   * Elimina una tarea por su identificador.
   *
   * @param id El identificador de la tarea a eliminar.
   */
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
  /**
   * Abre el modal de confirmación de eliminación.
   */
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
  /**
   * Elimina una cuenta de usuario.
   *
   * @remarks
   * Este método obtiene el correo electrónico del usuario a eliminar a partir de los parámetros de la ruta actual.
   * Luego, llama al servicio `dataService` para eliminar la cuenta asociada al correo electrónico proporcionado.
   * Si la eliminación es exitosa, se muestra un mensaje de éxito, se cierra el modal de eliminación, se borra la información del usuario y se redirige a la página de inicio de sesión después de 2 segundos.
   * En caso de error, se muestra un mensaje de error y se cierra el modal de eliminación.
   */
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
  /**
   * Abre el modal de detalles de usuario.
   * Obtiene los detalles del usuario a través del servicio de datos y los muestra en el formulario.
   * Si se encuentra el correo electrónico del usuario, se muestra el modal con los detalles del usuario.
   * Si ocurre un error al obtener los datos del usuario, se muestra una notificación de error.
   */
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
  /**
   * Actualiza los datos del usuario.
   */
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
  /**
   * Cierra la sesión del usuario.
   *
   * @remarks
   * Este método llama al servicio de datos para cerrar la sesión del usuario actual.
   * Si la operación es exitosa, muestra una notificación de éxito, borra los datos del usuario y redirige a la página de inicio de sesión después de 2 segundos.
   * Si ocurre un error, muestra una notificación de error.
   */
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

