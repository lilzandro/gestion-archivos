import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FileUpload = () => {
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [userId, setUserId] = useState(null)

  // Obtener el userId desde localStorage o desde un sistema de autenticación
  useEffect(() => {
    // Intentar obtener el userId de localStorage
    const storedUserId = localStorage.getItem('userId')

    if (storedUserId) {
      setUserId(storedUserId)
    } else {
      setMessage('No se encontró el ID del usuario. Por favor, inicia sesión.')
    }
  }, [])

  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!file) {
      setMessage('Por favor, selecciona un archivo.')
      return
    }

    if (!category || !description) {
      setMessage('Por favor, completa todos los campos.')
      return
    }

    if (!userId) {
      setMessage('No se ha encontrado el ID del usuario.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId) // El ID del usuario se envía al backend
    formData.append('category', category)
    formData.append('description', description)

    try {
      const response = await axios.post(
        'http://localhost:5000/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      setMessage(response.data.message)
      setFile(null)
      setCategory('')
      setDescription('')
    } catch (error) {
      console.error(error)
      setMessage('Hubo un error al subir el archivo.')
    }
  }

  return (
    <div className='container mt-4'>
      <h2>Subir Archivo</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='file' className='form-label'>
            Seleccionar archivo (PDF o imágenes)
          </label>
          <input
            type='file'
            className='form-control'
            id='file'
            onChange={handleFileChange}
            accept='.pdf, .jpg, .jpeg, .png'
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='category' className='form-label'>
            Categoría
          </label>
          <input
            type='text'
            className='form-control'
            id='category'
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
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
        <button type='submit' className='btn btn-primary'>
          Subir Archivo
        </button>
      </form>
      {message && <div className='alert alert-info mt-3'>{message}</div>}
    </div>
  )
}

export default FileUpload
