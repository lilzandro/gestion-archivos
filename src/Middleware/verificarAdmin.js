const db = require('../config/database')

const isAdmin = (req, res, next) => {
  const userId = req.user.id

  db.query('SELECT role FROM user WHERE id = ?', [userId], (err, results) => {
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

module.exports = isAdmin
