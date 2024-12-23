require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta'

// Inicializar la aplicación
const app = express()
const port = 5000

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Reemplaza con el dominio de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}
app.use(cors(corsOptions))

// Configuración para leer datos JSON
app.use(bodyParser.json())

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads') // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Nombre único para cada archivo
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos PDF e imágenes.'))
  }
}

const upload = multer({ storage, fileFilter })

// Hacer accesible la carpeta de archivos subidos
app.use('/uploads', express.static('uploads'))

// Conexión a la base de datos
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
    process.exit(1) // Detiene el servidor si no se puede conectar
  } else {
    console.log('Conectado a la base de datos MySQL')
  }
})

// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { nombre, apellido, cedula, email, password } = req.body

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

      const hashedPassword = await bcrypt.hash(password, 10)

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

      const user = results[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' })
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nombre: user.nombre,
          apellido: user.apellido
        },
        JWT_SECRET,
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

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
  const { userId, category, description } = req.body // ID del usuario, categoría y descripción
  const fileName = req.file.originalname // Nombre original del archivo
  const filePath = req.file.path // Ruta del archivo en el servidor

  // Guardar la información en la base de datos
  const query =
    'INSERT INTO files (user_id, file_name, file_path, category, description) VALUES (?, ?, ?, ?, ?)'
  db.query(
    query,
    [userId, fileName, filePath, category, description],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al guardar el archivo', error: err })
      }
      res.status(200).json({
        message: 'Archivo subido exitosamente',
        file: {
          id: result.insertId,
          userId,
          fileName,
          filePath,
          category,
          description
        }
      })
    }
  )
})

// Ruta para obtener los archivos de un usuario
app.get('/files/:userId', (req, res) => {
  const { userId } = req.params

  const query = 'SELECT * FROM files WHERE user_id = ? ORDER BY id DESC'
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error al obtener los archivos', error: err })
    }

    res.status(200).json(results)
  })
})

app.get('/validate-token', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1] // Extraer el token
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: 'Token inválido o expirado' })
    res.status(200).json({ message: 'Token válido', user: decoded })
  })
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`)
})
