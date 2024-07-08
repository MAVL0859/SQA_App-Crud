# Aplicación de Gestión de Tareas

## Descripción

Esta aplicación permite a los usuarios registrarse y gestionar sus tareas personales. Ofrece funcionalidades para añadir, eliminar, actualizar y leer tareas.

## Características

- **Registro de Usuario:** Los usuarios pueden registrarse en la aplicación para crear su cuenta personal.
- **Gestión de Tareas:** Una vez registrados, los usuarios tienen la capacidad de:
  - **Añadir Tareas:** Los usuarios pueden añadir nuevas tareas a su lista.
  - **Leer Tareas:** Los usuarios pueden ver todas sus tareas registradas.
  - **Actualizar Tareas:** Los usuarios pueden actualizar los detalles de una tarea existente.
  - **Eliminar Tareas:** Los usuarios pueden eliminar tareas que ya no sean necesarias.

## Tecnologías Utilizadas

- **Backend:** Node.js con Express para el manejo de las solicitudes HTTP.
- **Base de Datos:** Se utiliza una base de datos SQL para almacenar la información de usuarios y tareas.

## Endpoints

- `/register`: Endpoint para el registro de nuevos usuarios.
- `/login`: Endpoint para iniciar sesión.
- `/logout`: Endpoint para cerrar sesión.
- `/tasks`: Endpoint para obtener todas las tareas del usuario.
- `/tasks/add`: Endpoint para añadir una nueva tarea.
- `/tasks/update`: Endpoint para actualizar una tarea existente.
- `/tasks/delete`: Endpoint para eliminar una tarea.

## Cómo Empezar

Para iniciar la aplicación, asegúrate de tener Node.js instalado y sigue estos pasos:

1. Clona el repositorio a tu máquina local.
2. Navega al directorio del proyecto y ejecuta `npm install` para instalar las dependencias.
3. Ejecuta `node server.js` para iniciar el servidor.
4. Accede a la aplicación a través de `http://localhost:3000` en tu navegador.
5. Ejecuta `ng serve -o` para inicar la aplicación. Se abrirá automaticamente en tu navegador.

## Autor

Marlon Vera.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
