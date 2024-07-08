/**
 * Creación de la base de datos y tablas para almacenar datos de formularios y tareas.
 */

CREATE DATABASE formdata;

USE formdata;

/**
 * Tabla para almacenar los datos de registro de formularios.
 *
 * Campos:
 * - id: Identificador único del registro.
 * - name: Nombre del usuario que completó el formulario.
 * - lastname: Apellido del usuario que completó el formulario.
 * - email: Correo electrónico del usuario que completó el formulario.
 * - password: Contraseña del usuario que completó el formulario.
 * - phonenumber: Número de teléfono del usuario que completó el formulario (opcional).
 */
CREATE TABLE registerForm (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  lastname VARCHAR(250) NOT NULL,
  email VARCHAR(250) NOT NULL,
  password VARCHAR(250) NOT NULL,
  phonenumber VARCHAR(10) NULL
);

/**
 * Tabla para almacenar las tareas.
 *
 * Campos:
 * - id: Identificador único de la tarea.
 * - title: Título de la tarea.
 * - description: Descripción detallada de la tarea.
 */
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- SELECT * FROM tasks;

-- DROP TABLE tasks;
