import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import axios from 'axios'
import ArchivoCard from '../../ArchivoCard'

const BuscarArchivo = ({ handleViewFile }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token') // O de donde sea que obtengas el token
      const response = await axios.get(
        `http://localhost:5000/search?term=${searchTerm}`,
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

  return (
    <Container>
      <Row className='mb-4'>
        <Col>
          <Form.Control
            type='text'
            placeholder='Buscar por nombre o categoría'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
              />
            ) : null
          )
        ) : (
          <div className='text-center'>
            <p className='text-muted'>No se encontraron archivos.</p>
          </div>
        )}
      </Row>
    </Container>
  )
}

export default BuscarArchivo
