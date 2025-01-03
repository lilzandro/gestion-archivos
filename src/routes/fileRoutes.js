const express = require('express')
const multer = require('multer')
const db = require('../config/database')
const authenticateToken = require('../middleware/jwt')
const path = require('path')

const router = express.Router()

// Configuración de Multer
const storage = multer.diskStorage({
  // Ajustar la carpeta 'uploads' fuera de 'services', ahora directamente dentro de 'src'
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/
  if (allowedTypes.test(file.mimetype)) cb(null, true)
  else cb(new Error('Solo se permiten archivos PDF e imágenes.'))
}
const upload = multer({ storage, fileFilter })

// Subir archivo
router.post('/upload', authenticateToken, upload.single('file'), (req, res) => {
  const { userId, category, description } = req.body
  const fileName = req.file.originalname
  // Ruta relativa para el archivo guardado fuera de 'services'
  const filePath = path.join('uploads', req.file.filename)

  // Paso 1: Verificar si la categoría existe
  const categoryQuery = 'SELECT id FROM categories WHERE name = ?'
  db.query(categoryQuery, [category], (err, categoryResult) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'Error al verificar la categoría', error: err })

    let categoryId

    if (categoryResult.length > 0) {
      // La categoría existe
      categoryId = categoryResult[0].id
      saveFile(categoryId)
    } else {
      // Paso 2: Crear la categoría si no existe
      const insertCategoryQuery = 'INSERT INTO categories (name) VALUES (?)'
      db.query(insertCategoryQuery, [category], (err, insertResult) => {
        if (err)
          return res
            .status(500)
            .json({ message: 'Error al crear la categoría', error: err })

        categoryId = insertResult.insertId
        saveFile(categoryId)
      })
    }
  })

  // Paso 3: Guardar el archivo con la categoría
  const saveFile = categoryId => {
    const insertFileQuery =
      'INSERT INTO files (user_id, file_name, file_path, category_id, description) VALUES (?, ?, ?, ?, ?)'
    db.query(
      insertFileQuery,
      [userId, fileName, filePath, categoryId, description],
      (err, fileResult) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Error al guardar el archivo', error: err })
        }
        res.status(200).json({
          message: 'Archivo subido exitosamente',
          file: {
            id: fileResult.insertId,
            file_name: fileName,
            file_path: filePath, // Ruta relativa guardada en la base de datos
            category,
            description
          }
        })
      }
    )
  }
})

// Obtener archivos con categorías
router.get('/files/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params
  const query = `
    SELECT 
      f.id, 
      f.file_name, 
      f.file_path, 
      f.description, 
      f.created_at, 
      c.name AS category 
    FROM 
      files f
    LEFT JOIN 
      categories c 
    ON 
      f.category_id = c.id
    WHERE 
      f.user_id = ? 
    ORDER BY 
      f.id DESC
  `
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error al obtener los archivos', error: err })
    }
    res.status(200).json(results)
  })
})

// Obtener categorías
router.get('/categories', authenticateToken, (req, res) => {
  db.query('SELECT id, name FROM categories', (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ message: 'Error al obtener categorías', error: err })
    res.status(200).json(results)
  })
})

module.exports = router
