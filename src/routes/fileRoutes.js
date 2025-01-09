const express = require('express')
const multer = require('multer')
const db = require('../config/database')
const authenticateToken = require('../middleware/jwt')
const isAdmin = require('../Middleware/verificarAdmin')
const path = require('path')

const router = express.Router()

// Configuración de Multer
const storage = multer.diskStorage({
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

// Subir archivo (solo administrador)
router.post(
  '/upload',
  authenticateToken,
  isAdmin,
  upload.single('file'),
  (req, res) => {
    const { userId, category, description, newCategory } = req.body
    const fileName = req.file.originalname
    const filePath = path.join('uploads', req.file.filename)

    const saveFile = (categoryId, categoryName) => {
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
              file_path: filePath,
              category: categoryName,
              description
            }
          })
        }
      )
    }

    if (newCategory) {
      // Crear la categoría si no existe
      const insertCategoryQuery = 'INSERT INTO categories (name) VALUES (?)'
      db.query(insertCategoryQuery, [newCategory], (err, insertResult) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Error al crear la categoría', error: err })
        }

        const categoryId = insertResult.insertId
        saveFile(categoryId, newCategory)
      })
    } else {
      const checkCategoryQuery = 'SELECT id, name FROM categories WHERE id = ?'
      db.query(checkCategoryQuery, [category], (err, categoryResult) => {
        if (err) {
          return res
            .status(500)
            .json({ message: 'Error al verificar la categoría', error: err })
        }

        if (categoryResult.length === 0) {
          return res
            .status(400)
            .json({ message: 'La categoría seleccionada no existe' })
        }

        const categoryId = categoryResult[0].id
        const categoryName = categoryResult[0].name
        saveFile(categoryId, categoryName)
      })
    }
  }
)

// Crear nueva categoría (solo administrador)
router.post('/categories', authenticateToken, isAdmin, (req, res) => {
  const { name } = req.body

  // Verificar si la categoría ya existe
  const checkCategoryQuery = 'SELECT id FROM categories WHERE name = ?'
  db.query(checkCategoryQuery, [name], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error al verificar la categoría', error: err })
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'La categoría ya existe' })
    }

    // Crear la categoría si no existe
    const insertCategoryQuery = 'INSERT INTO categories (name) VALUES (?)'
    db.query(insertCategoryQuery, [name], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al crear la categoría', error: err })
      }
      res.status(200).json({ message: 'Categoría creada exitosamente' })
    })
  })
})

// Obtener todos los archivos con categorías
router.get('/files', authenticateToken, (req, res) => {
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
    ORDER BY 
      f.id DESC
  `
  db.query(query, (err, results) => {
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

// Buscar archivos por nombre o categoría
router.get('/search', authenticateToken, (req, res) => {
  const { term } = req.query
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
      f.file_name LIKE ? OR c.name LIKE ?
    ORDER BY 
      f.id DESC
  `
  const searchTerm = `%${term}%`
  db.query(query, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error al buscar archivos', error: err })
    }
    res.status(200).json(results)
  })
})

// Eliminar archivo (solo administrador)
router.delete('/files/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params

  const deleteFileQuery = 'DELETE FROM files WHERE id = ?'
  db.query(deleteFileQuery, [id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Error al eliminar el archivo', error: err })
    }
    res.status(200).json({ message: 'Archivo eliminado exitosamente' })
  })
})

// Eliminar categoría (solo administrador)
router.delete('/categories/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params

  const checkFilesQuery =
    'SELECT COUNT(*) AS fileCount FROM files WHERE category_id = ?'
  db.query(checkFilesQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Error al verificar archivos en la categoría',
        error: err
      })
    }

    if (results[0].fileCount > 0) {
      return res.status(400).json({
        message:
          'No se puede eliminar la categoría porque tiene archivos relacionados'
      })
    }

    const deleteCategoryQuery = 'DELETE FROM categories WHERE id = ?'
    db.query(deleteCategoryQuery, [id], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: 'Error al eliminar la categoría', error: err })
      }
      res.status(200).json({ message: 'Categoría eliminada exitosamente' })
    })
  })
})

module.exports = router
