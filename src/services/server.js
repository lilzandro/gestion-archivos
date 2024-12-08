const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = 5000

// Configuración de CORS
app.use(cors())

// Configuración para leer datos JSON
app.use(bodyParser.json())

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia por tu usuario de MySQL
  password: '123lisisdaxcz', // Cambia por tu contraseña de MySQL
  database: 'gestion_file' // Nombre de tu base de datos
})

// Conexión a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos: ', err)
  } else {
    console.log('Conectado a la base de datos MySQL')
  }
})

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { nombre, apellido, cedula, email, password } = req.body

  // Validar si el email ya existe
  db.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al verificar el correo', error: err })
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'El correo ya está registrado' })
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10)

      // Insertar el nuevo usuario
      db.query(
        'INSERT INTO user (nombre, apellido, cedula, email, password) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, cedula, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: 'Error al registrar el usuario', error: err })
          }
          res.status(201).json({ message: 'Usuario registrado exitosamente' })
        }
      )
    }
  )
})

// Ruta de login
app.post('/login', (req, res) => {
  const { email, password } = req.body

  // Verificar si el usuario existe
  db.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al verificar el correo', error: err })
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'El usuario no existe' })
      }

      // Verificar la contraseña
      const user = results[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' })
      }

      // Generar un token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido
        },
        'tu_clave_secreta',
        { expiresIn: '1h' }
      )

      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email
        }
      })
    }
  )
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
