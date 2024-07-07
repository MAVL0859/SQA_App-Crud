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
}
