import React, { useState } from 'react'
import { Row, Col, Card, Button, Form } from 'react-bootstrap'

const ContenidoArchivo = ({ files = [] }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('')

  const filteredFiles = files.filter(file => {
    // Verificar que file y sus propiedades existan antes de usarlas
    if (!file || !file.name) return false

    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory = category ? file.category === category : true

    return matchesSearch && matchesCategory
  })

  return (
    <div className='documents-content'>
      <Row className='mb-4'>
        <Col md={8}>
          <Form.Control
            type='text'
            placeholder='Buscar archivo...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className='mt-3 mt-md-0'
          >
            <option value=''>Todas las categorías</option>
            <option value='Documentos'>Documentos</option>
            <option value='Imágenes'>Imágenes</option>
            <option value='Presentaciones'>Presentaciones</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className='gy-4 gx-4'>
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <Col md={4} key={file.id}>
              <Card>
                <Card.Body>
                  <Card.Title>{file.name}</Card.Title>
                  <Card.Text>
                    Tamaño: {file.size}
                    <br />
                    Fecha: {file.date}
                  </Card.Text>
                  <Button variant='danger' size='sm'>
                    Eliminar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p className='text-muted text-center'>No se encontraron archivos.</p>
        )}
      </Row>
    </div>
  )
}

export default ContenidoArchivo
