import React from 'react'
import { Card, Button, Col } from 'react-bootstrap'
import { AiFillFilePdf, AiFillPicture } from 'react-icons/ai'

const ArchivoCard = ({ file, handleViewFile }) => {
  return (
    <Col xs={12} md={4} key={file.id}>
      <Card
        className='shadow-sm h-100 w-100'
        style={{
          maxWidth: '300px',
          minHeight: '200px',
          maxHeight: '250px',
          margin: '0 auto'
        }}
      >
        <Card.Body className='d-flex align-items-center'>
          {/* Ícono del archivo */}
          <span className='fs-1 me-4 m-1'>
            {file.file_name.endsWith('.pdf') ? (
              <AiFillFilePdf color='#FF0000' size={60} />
            ) : (
              <AiFillPicture color='#00A1FF' size={60} />
            )}
          </span>
          {/* Información del archivo */}
          <div className='text-truncate' style={{ overflow: 'hidden' }}>
            <Card.Title className='fw-bold text-truncate'>
              {file.file_name}
            </Card.Title>
            <Card.Text>
              <span className='fw-semibold text-primary'>Categoría:</span>{' '}
              {file.category || (
                <span className='text-muted'>Sin categoría</span>
              )}
              <br />
              <span className='fw-semibold text-primary'>
                Descripción:
              </span>{' '}
              {file.description || (
                <span className='text-muted'>Sin descripción</span>
              )}
              <br />
              <span className='fw-semibold text-primary'>Subido el:</span>{' '}
              {file.created_at
                ? new Date(file.created_at).toLocaleDateString()
                : 'Fecha no disponible'}
            </Card.Text>
            <Button
              variant='outline-primary'
              size='sm'
              onClick={() =>
                handleViewFile(
                  `http://localhost:5000/${file.file_path}`,
                  file.file_name
                )
              }
            >
              Ver Archivo
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default ArchivoCard
