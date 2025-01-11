const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/database')
const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta'
const authenticateToken = require('../middleware/jwt')

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
// ...existing code...
router.post('/register', async (req, res) => {
  const { nombre, apellido, cedula, username, password, securityAnswers } =
    req.body

  db.query(
    'SELECT * FROM user WHERE username = ?',
    [username],
    async (err, results) => {
      if (err)
        return res.status(500).json({
          message: 'Error al verificar el nombre de usuario',
          error: err
        })

      if (results.length > 0)
        return res
          .status(400)
          .json({ message: 'El nombre de usuario ya está registrado' })

      const hashedPassword = await bcrypt.hash(password, 10)

      db.query(
        'INSERT INTO user (nombre, apellido, cedula, username, password) VALUES (?, ?, ?, ?, ?)',
        [nombre, apellido, cedula, username, hashedPassword],
        (err, results) => {
          if (err)
            return res
              .status(500)
              .json({ message: 'Error al registrar el usuario', error: err })

          // Obtener el ID del nuevo usuario
          const newUserId = results.insertId

          // Insertar respuestas de seguridad
          const securityAnswerQueries = securityAnswers.map(answer => {
            return new Promise((resolve, reject) => {
              db.query(
                'INSERT INTO security_answers (user_id, question, answer) VALUES (?, ?, ?)',
                [newUserId, answer.question, answer.answer],
                (err, results) => {
                  if (err) reject(err)
                  resolve(results)
                }
              )
            })
          })

          Promise.all(securityAnswerQueries)
            .then(() => {
              // Crear token JWT
              const token = jwt.sign(
                {
                  id: newUserId,
                  username,
                  nombre,
                  apellido
                },
                JWT_SECRET,
                { expiresIn: '1h' }
              )

              // Responder con el usuario y el token
              res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: {
                  id: newUserId,
                  nombre,
                  apellido,
                  username
                },
                token
              })
            })
            .catch(err => {
              res.status(500).json({
                message: 'Error al registrar las respuestas de seguridad',
                error: err
              })
            })
        }
      )
    }
  )
})
// ...existing code...

// Ruta de login
router.post('/login', (req, res) => {
  const { username, password } = req.body

  db.query(
    'SELECT * FROM user WHERE username = ?',
    [username],
    async (err, results) => {
      if (err)
        return res.status(500).json({
          message: 'Error al verificar el nombre de usuario',
          error: err
        })

      if (results.length === 0)
        return res.status(400).json({ message: 'El usuario no existe' })

      const user = results[0]
      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch)
        return res.status(400).json({ message: 'Contraseña incorrecta' })

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          nombre: user.nombre,
          apellido: user.apellido,
          role: user.role // Asegúrate de incluir el rol del usuario en el token
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
          username: user.username,
          role: user.role // Asegúrate de incluir el rol del usuario en la respuesta
        }
      })
    }
  )
})

const isAdmin = (req, res, next) => {
  const userId = req.user.id

  db.query('SELECT rol FROM user WHERE id = ?', [userId], (err, results) => {
    if (err || results.length === 0) {
      return res
        .status(500)
        .json({ message: 'Error al verificar el rol del usuario' })
    }

    if (results[0].role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado' })
    }

    next()
  })
}

router.get('/user/:id', async (req, res) => {
  const userId = req.params.id
  db.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error al obtener la información del usuario' })
    }
    res.status(200).json(results[0])
  })
})

// Ruta para actualizar la información del usuario
router.put('/user/:id', authenticateToken, (req, res) => {
  const userId = req.params.id
  const { nombre, apellido, cedula, username } = req.body

  const updateUserQuery = `
    UPDATE user 
    SET nombre = ?, apellido = ?, cedula = ?, username = ? 
    WHERE id = ?
  `
  db.query(
    updateUserQuery,
    [nombre, apellido, cedula, username, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: 'Error al actualizar la información del usuario',
          error: err
        })
      }
      res
        .status(200)
        .json({ message: 'Información del usuario actualizada exitosamente' })
    }
  )
})

module.exports = isAdmin

module.exports = router
