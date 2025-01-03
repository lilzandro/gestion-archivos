const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta'

router.get('/validate-token', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1] // Extraer el token del header

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' })
    }
    res.status(200).json({ message: 'Token válido', user: decoded })
  })
})

// Ruta de registro
router.post('/register', async (req, res) => {
  const { nombre, apellido, cedula, email, password } = req.body

  db.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    async (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Error al verificar el correo', error: err })

      if (results.length > 0)
        return res.status(400).json({ message: 'El correo ya está registrado' })

      const hashedPassword = await bcrypt.hash(password, 10)

      db.query(
        'INSERT INTO user (nombre, apellido, cedula, email, password) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, cedula, email, hashedPassword],
        err => {
          if (err)
            return res
              .status(500)
              .json({ message: 'Error al registrar el usuario', error: err })
          res.status(201).json({ message: 'Usuario registrado exitosamente' })
        }
      )
    }
  )
})

// Ruta de login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  db.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    async (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: 'Error al verificar el correo', error: err })

      if (results.length === 0)
        return res.status(400).json({ message: 'El usuario no existe' })

      const user = results[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch)
        return res.status(400).json({ message: 'Contraseña incorrecta' })

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

module.exports = router
