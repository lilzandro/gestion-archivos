import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { FaFile } from 'react-icons/fa'
import { Toaster, toast } from 'react-hot-toast'

const SubirArchivo = ({ setUploadedFiles }) => {
  const [file, setFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
      fetchCategories()
    } else {
      setMessage('No se encontró el ID del usuario. Por favor, inicia sesión.')
    }
  }, [])

  useEffect(() => {
    if (message) {
      toast.success(message)
      setMessage('')
    }
    if (error) {
      toast.error(error)
      setError('')
    }
  }, [message, error])

  // Obtener las categorías desde el backend
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/categories', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCategories(response.data)
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  }

  // Configuración de React Dropzone
  const onDrop = acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const fileType = acceptedFiles[0].type
      if (
        fileType === 'application/pdf' ||
        fileType === 'image/jpeg' ||
        fileType === 'image/png'
      ) {
        setFile(acceptedFiles[0])
        setError('')
      } else {
        setError('Solo se permiten archivos PDF, JPG o PNG.')
        setFile(null)
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png, application/pdf'
  })

  // ...existing code...

  const handleSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!file || (!category && !newCategory) || !description || !userId) {
      toast.error('Por favor, completa todos los campos.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    formData.append('category', category) // Enviar categoría existente como ID
    formData.append('newCategory', newCategory) // Enviar nueva categoría si existe
    formData.append('description', description)

    try {
      const response = await axios.post(
        'http://localhost:5000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success(response.data.message)
      setFile(null)
      setCategory('')
      setNewCategory('')
      setDescription('')

      // Actualizar lista de archivos
      const updatedFiles = await axios.get('http://localhost:5000/files', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUploadedFiles(updatedFiles.data)

      // Refrescar categorías
      fetchCategories()
    } catch (error) {
      console.error(error)
      toast.error('Hubo un error al subir el archivo.')
    }
  }

  // ...existing code...

  const handleCreateCategory = async () => {
    const token = localStorage.getItem('token')
    if (!newCategory) {
      toast.error('Por favor, ingresa un nombre para la nueva categoría.')
      return
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/categories',
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success(response.data.message)
      setNewCategory('')
      fetchCategories() // Refrescar categorías después de crear una nueva
    } catch (error) {
      console.error('Error al crear la categoría:', error)
      const errorMessage =
        error.response?.data?.message || 'Error al crear la categoría.'
      toast.error(errorMessage)
    }
  }

  const handleDeleteCategory = async categoryId => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(
        `http://localhost:5000/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      toast.success(response.data.message)
      setCategory('') // Restablecer la selección de categoría
      setNewCategory('') // Restablecer la nueva categoría
      fetchCategories()
    } catch (error) {
      console.error('Error al eliminar la categoría:', error)
      toast.error(
        error.response?.data?.message || 'Error al eliminar la categoría.'
      )
    }
  }

  return (
    <div className='container mt-4'>
      <Toaster />
      <form onSubmit={handleSubmit} className='p-4 rounded'>
        <div
          {...getRootProps()}
          className={`dropzone border p-4 text-center rounded position-relative ${
            isDragActive ? 'bg-success text-white' : 'bg-light'
          }`}
          style={{
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            borderColor: isDragActive ? '#28a745' : '#ced4da'
          }}
        >
          <input {...getInputProps()} />
          <FaFile size={40} className='mb-2' />
          {isDragActive ? (
            <p>Suelta el archivo aquí...</p>
          ) : file ? (
            <p>Archivo seleccionado: {file.name}</p>
          ) : (
            <p>
              Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo.
            </p>
          )}
        </div>
        {error && <div className='alert alert-danger mt-3'>{error}</div>}
        <div className='mb-3 mt-3'>
          {!newCategory && (
            <>
              <label htmlFor='category' className='form-label'>
                Seleccionar Categoría
              </label>
              <div className='input-group'>
                <select
                  className='form-control'
                  id='category'
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value=''>Seleccionar categoría existente</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={() => handleDeleteCategory(category)}
                >
                  Eliminar
                </button>
              </div>
            </>
          )}
          {!category && (
            <div className='mt-3'>
              <label htmlFor='newCategory' className='form-label'>
                O agregar nueva categoría
              </label>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  id='newCategory'
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder='Escribe nueva categoría'
                />
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={handleCreateCategory}
                >
                  Crear
                </button>
              </div>
            </div>
          )}
        </div>
        <div className='mb-3'>
          <label htmlFor='description' className='form-label'>
            Descripción
          </label>
          <textarea
            className='form-control'
            id='description'
            rows='3'
            value={description}
            onChange={e => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type='submit' className='btn btn-primary w-100'>
          Subir Archivo
        </button>
      </form>
      {message && (
        <div className='alert alert-info mt-3 text-center'>{message}</div>
      )}
    </div>
  )
}

export default SubirArchivo
