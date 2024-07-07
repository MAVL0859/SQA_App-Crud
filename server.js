/**
 * @fileoverview Este archivo contiene el código del servidor para una aplicación Node.js que maneja el registro de usuarios, inicio de sesión, eliminación de cuenta y recuperación de detalles del usuario.
 * @module server
 * @requires express
 * @requires body-parser
 * @requires cors
 * @requires mysql2
 * @requires bcrypt
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // Para el cifrado de contraseñas

/**
 * Instancia de la aplicación Express.
 * @type {import('express').Express}
 */
const app = express();
const port = 3000;

// Configuraciones del CORS
app.use(cors());
// Configuraciones del Body Parser
app.use(bodyParser.json());

// Configurar la conexión a la base de datos MySQL
/**
 * Objeto de conexión a la base de datos.
 * @type {mysql.Connection}
 */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ariel2004',
  database: 'formdata'
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL.');
});

// Endpoint para manejar el registro de usuarios
app.post('/register', (req, res) => {
  const { name, lastname, email, password, phonenumber } = req.body;

  // Verificar si el correo electrónico ya existe en la base de datos
  const checkEmailQuery = 'SELECT * FROM registerform WHERE email = ?';
  db.query(checkEmailQuery, [email], (err, results) => {
    if (err) {
      console.error('Error al verificar el correo electrónico:', err);
      res.status(500).json({ error: 'Error en la verificación del correo electrónico' });
      return;
    }

    if (results.length > 0) {
      // Si el correo electrónico ya existe, envía una respuesta de error
      res.status(400).json({ error: 'El correo electrónico ya está registrado' });
      return;
    }

    // Si el correo electrónico no existe, continúa con el registro
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.error('Error generando el salt:', err);
        res.status(500).json({ error: 'Error generando el salt' });
        return;
      }

      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          console.error('Error cifrando la contraseña:', err);
          res.status(500).json({ error: 'Error cifrando la contraseña' });
          return;
        }

        const insertQuery = 'INSERT INTO registerform (name, lastname, email, password, phonenumber) VALUES (?, ?, ?, ?, ?)';
        db.query(insertQuery, [name, lastname, email, hashedPassword, phonenumber], (err, result) => {
          if (err) {
            console.error('Error al insertar datos:', err);
            res.status(500).json({ error: 'Error en la inserción de datos' });
            return;
          }

          // Respuesta con mensaje estructurado y mensaje de texto
          console.log('Datos insertados correctamente:', result);
          res.status(200).json({ message: 'Datos insertados y guardados', result });
        });
      });
    });
  });
});

// Endpoint para el inicio de sesión de usuarios registrados
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT password FROM registerform WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      res.status(500).json({ error: 'Error al buscar usuario' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Usuario no encontrado. Regístrese antes de iniciar sesión' });
      return;
    }

    const hashedPassword = results[0].password;

    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        console.error('Error al comparar contraseñas:', err);
        res.status(500).json({ error: 'Error al comparar contraseñas' });
        return;
      }

      if (isMatch) {
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        res.status(401).json({ error: 'Contraseña incorrecta' });
      }
    });
  });
});

// Endpoint para eliminar la cuenta del usuario
app.delete('/delete-account', (req, res) => {
  const email = req.query.email; // Obtener el email de la consulta

  const query = 'DELETE FROM registerform WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error al eliminar la cuenta:', err);
      res.status(500).json({ error: 'Error al eliminar la cuenta' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Cuenta no encontrada' });
      return;
    }

    res.status(200).json({ message: 'Cuenta eliminada correctamente' });
  });
});

// Endpoint para obtener los detalles del usuario
app.get('/user-details', (req, res) => {
  const email = req.query.email; // Obtener el email de la consulta

  const query = 'SELECT name, lastname, email, phonenumber FROM registerform WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error al obtener los datos del usuario:', err);
      res.status(500).json({ error: 'Error al obtener los datos del usuario' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json(results[0]);
  });
});

// Endpoint para actualizar los datos del usuario
app.put('/update-user', (req, res) => {
  const { name, lastname, email, phonenumber } = req.body;

  const query = 'UPDATE registerform SET name = ?, lastname = ?, phonenumber = ? WHERE email = ?';
  db.query(query, [name, lastname, phonenumber, email], (err, result) => {
    if (err) {
      console.error('Error al actualizar los datos del usuario:', err);
      res.status(500).json({ error: 'Error al actualizar los datos del usuario' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({ message: 'Datos del usuario actualizados correctamente' });
  });
});

// Endpoint para cerrar sesión
app.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

// Ruta para la página principal
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor Node.js!');
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Servidor corriendo en: http://localhost:${port}`);
});
