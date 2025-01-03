import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import { FaFile } from 'react-icons/fa'

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

  const handleSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!file || (!category && !newCategory) || !description || !userId) {
      setMessage('Por favor, completa todos los campos.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    formData.append('category', newCategory || category) // Priorizar nueva categoría
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

      setMessage(response.data.message)
      setFile(null)
      setCategory('')
      setNewCategory('')
      setDescription('')

      // Actualizar lista de archivos
      const updatedFiles = await axios.get(
        `http://localhost:5000/files/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUploadedFiles(updatedFiles.data)

      // Refrescar categorías
      fetchCategories()
    } catch (error) {
      console.error(error)
      setMessage('Hubo un error al subir el archivo.')
    }
  }

  return (
    <div className='container mt-4'>
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
              <select
                className='form-control'
                id='category'
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value=''>Seleccionar categoría existente</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </>
          )}
          {!category && (
            <div className='mt-3'>
              <label htmlFor='newCategory' className='form-label'>
                O agregar nueva categoría
              </label>
              <input
                type='text'
                className='form-control'
                id='newCategory'
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                placeholder='Escribe nueva categoría'
              />
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