import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const EditModal = ({
  show,
  onHide,
  editedData,
  handleEditChange,
  handleSaveChanges
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Información</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type='text'
              name='nombre'
              value={editedData.nombre || ''}
              onChange={handleEditChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type='text'
              name='apellido'
              value={editedData.apellido || ''}
              onChange={handleEditChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type='text'
              name='cedula'
              value={editedData.cedula || ''}
              onChange={handleEditChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Nombre de Usuario</Form.Label>
            <Form.Control
              type='text'
              name='username'
              value={editedData.username || ''}
              onChange={handleEditChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EditModal
