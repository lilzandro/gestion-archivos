require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const authRoutes = require('../routes/authRoutes')
const fileRoutes = require('../routes/fileRoutes')
const path = require('path')
const mime = require('mime-types')

const app = express()
const port = process.env.PORT || 5000

// Configuración de CORS
app.use(cors({ origin: 'http://localhost:3000' }))

// Middleware
app.use(bodyParser.json())

// Middleware para servir archivos estáticos con el tipo de contenido correcto
app.use(
  '/uploads',
  (req, res, next) => {
    const filePath = path.join(__dirname, '..', 'uploads', req.path)
    const mimeType = mime.lookup(filePath)
    res.setHeader('Content-Type', mimeType)
    if (mimeType === 'application/pdf') {
      res.setHeader('Content-Disposition', 'inline') // Asegura que los PDFs se visualicen en el navegador
    }
    next()
  },
  express.static(path.join(__dirname, '..', 'uploads'))
)

// Rutas
app.use(authRoutes)
app.use(fileRoutes)

// Iniciar servidor
app.listen(port, () =>
  console.log(`Servidor corriendo en http://localhost:${port}`)
)
