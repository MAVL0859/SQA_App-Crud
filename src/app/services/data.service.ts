import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio para manejar datos relacionados con el registro de usuarios, inicio de sesión, gestión de cuentas y cierre de sesión.
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private registerURL = "http://localhost:3000/register"; // URL para registrar una nueva cuenta
  private loginURL = "http://localhost:3000/login"; // URL para iniciar sesión en la cuenta
  private deleteAccountURL = "http://localhost:3000/delete-account"; // URL para eliminar la cuenta
  private userDetailsURL = "http://localhost:3000/user-details"; // URL para obtener detalles del usuario
  private updateUserURL = "http://localhost:3000/update-user"; // URL para actualizar los datos del usuario
  private logoutURL = "http://localhost:3000/logout"; // URL para cerrar sesión
  private tasksURL = "http://localhost:3000/tasks"; // URL para gestionar tareas


  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo usuario en la aplicación.
   * @param data - Los datos del usuario que se va a registrar.
   * @returns Un observable que emite la respuesta del servidor.
   */
  register(data: any): Observable<any> {
    return this.http.post(this.registerURL, data);
  }

  /**
   * Inicia sesión para un usuario.
   * @param data - Las credenciales de inicio de sesión del usuario.
   * @returns Un observable que emite la respuesta del servidor.
   */
  login(data: any): Observable<any> {
    return this.http.post(this.loginURL, data);
  }

  /**
   * Elimina la cuenta de un usuario.
   * @param email - El correo electrónico de la cuenta que se va a eliminar.
   * @returns Un observable que emite la respuesta del servidor.
   */
  deleteAccount(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.delete(this.deleteAccountURL, { params });
  }

  /**
   * Recupera los detalles de un usuario.
   * @param email - El correo electrónico del usuario.
   * @returns Un observable que emite la respuesta del servidor.
   */
  getUserDetails(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get(this.userDetailsURL, { params });
  }

  /**
   * Actualiza los detalles de un usuario.
   * @param data - Los datos actualizados del usuario.
   * @returns Un observable que emite la respuesta del servidor.
   */
  updateUser(data: any): Observable<any> {
    return this.http.put(this.updateUserURL, data);
  }

  /**
   * Cierra la sesión del usuario actual.
   * @returns Un observable que emite la respuesta del servidor.
   */
  logout(): Observable<any> {
    return this.http.post(this.logoutURL, {});
  }

   /**
   * Obtiene todas las tareas de un usuario específico.
   * @param userEmail - El correo electrónico del usuario para filtrar las tareas.
   * @returns Un observable que emite la respuesta del servidor.
   */
   getTasks(userEmail: string): Observable<any> {
    const params = new HttpParams().set('email', userEmail);
    return this.http.get(this.tasksURL, { params });
  }

  /**
   * Crea una nueva tarea para un usuario específico.
   * @param userEmail - El correo electrónico del usuario al que se asignará la tarea.
   * @param task - Los datos de la tarea que se va a crear.
   * @returns Un observable que emite la respuesta del servidor.
   */
  createTask(userEmail: string, task: any): Observable<any> {
    task.email = userEmail; // Añadir el correo electrónico al objeto de tarea
    return this.http.post(this.tasksURL, task);
  }

  /**
   * Actualiza una tarea existente para un usuario específico.
   * @param id - El ID de la tarea a actualizar.
   * @param task - Los datos actualizados de la tarea.
   * @returns Un observable que emite la respuesta del servidor.
   */
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.tasksURL}/${id}`, task);
  }

  /**
   * Elimina una tarea específica para un usuario.
   * @param id - El ID de la tarea a eliminar.
   * @returns Un observable que emite la respuesta del servidor.
   */
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.tasksURL}/${id}`);
  }
}

