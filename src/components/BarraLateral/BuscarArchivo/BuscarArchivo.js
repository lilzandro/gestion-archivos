import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'
import ArchivoCard from '../../ArchivoCard'
import { useUser } from '../../UserContext'
import { FileContext } from '../../Dashboard'

const BuscarArchivo = ({ handleViewFile }) => {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const { uploadedFiles, setUploadedFiles } = useContext(FileContext)

  useEffect(() => {
    fetchCategories()
    fetchAllFiles()
  }, [])

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

  const fetchAllFiles = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/files', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error al obtener archivos:', error)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedCategory) {
      toast.error(
        'Por favor, ingresa un término de búsqueda o selecciona una categoría.'
      )
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `http://localhost:5000/search?term=${searchTerm}&category=${selectedCategory}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setSearchResults(response.data)
    } catch (error) {
      console.error('Error al buscar archivos:', error)
    }
  }

  const handleDeleteFile = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/files/${fileToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUploadedFiles(uploadedFiles.filter(file => file.id !== fileToDelete))
      setShowDeleteModal(false)

      // Actualiza la lista de archivos después de eliminar
      fetchAllFiles()

      // Mostrar notificación de éxito
      toast.success('Archivo eliminado con éxito!')
    } catch (error) {
      console.error('Error al eliminar archivo:', error)

      // Mostrar notificación de error
      toast.error('Hubo un problema al eliminar el archivo.')
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      if (selectedCategory === 'all') {
        fetchAllFiles()
      } else {
        handleSearch()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const handleKeyPress = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSearch()
    }
  }

  return (
    <Container>
      <Toaster />
      <Row className='mb-4'>
        <Col>
          <Form.Control
            type='text'
            placeholder='Buscar por nombre el archivo'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </Col>
        <Col xs='auto'>
          <Form.Control
            as='select'
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value=''>Seleccionar categoría</option>
            <option value='all'>Todos</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Form.Control>
        </Col>
        <Col xs='auto'>
          <Button variant='primary' onClick={handleSearch}>
            Buscar
          </Button>
        </Col>
      </Row>
      <Row className='gy-4'>
        {searchResults.length > 0 ? (
          searchResults.map(file =>
            file && file.file_name ? (
              <ArchivoCard
                key={file.id}
                file={file}
                handleViewFile={handleViewFile}
                handleDeleteFile={() => {
                  setFileToDelete(file.id)
                  setShowDeleteModal(true)
                }}
                isAdmin={user && user.role === 'admin'}
              />
            ) : null
          )
        ) : (
          <div className='text-center'>
            <p className='text-muted'>No se encontraron archivos.</p>
          </div>
        )}
      </Row>

      {/* Modal de Confirmación para Eliminar Archivo */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación de Archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este archivo?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={handleDeleteFile}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default BuscarArchivo
