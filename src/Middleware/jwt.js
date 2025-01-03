const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta'

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token no proporcionado' })

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: 'Token inválido o expirado' })
    req.user = decoded // Adjunta el usuario decodificado a la solicitud
    next()
  })
}

module.exports = authenticateToken
