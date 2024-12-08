import React, { useState } from 'react'
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap'

const ProfileContent = ({ userProfile, onDeleteAccount }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email || '',
    role: userProfile.role,
    avatar: userProfile.avatar
  })

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveChanges = () => {
    console.log('Información actualizada:', formData)
    setIsEditing(false)
  }

  const handleDeleteAccount = () => {
    onDeleteAccount()
    setShowDeleteModal(false)
  }

  return (
    <Container className='mt-4'>
      <Row>
        <Col md={4} className='text-center'>
          <img
            src={formData.avatar}
            alt='Avatar'
            className='rounded-circle mb-3'
            width={150}
            height={150}
          />
          {isEditing && (
            <Form.Group controlId='avatar' className='mb-3'>
              <Form.Label>Cambiar Avatar (URL)</Form.Label>
              <Form.Control
                type='text'
                placeholder='URL de la nueva imagen'
                name='avatar'
                value={formData.avatar}
                onChange={handleInputChange}
              />
            </Form.Group>
          )}
        </Col>
        <Col md={8}>
          <h3>Información del Usuario</h3>
          <Form>
            <Form.Group controlId='name' className='mb-3'>
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type='text'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type='email'
                name='email'
                placeholder='ejemplo@correo.com'
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
            <Form.Group controlId='role' className='mb-3'>
              <Form.Label>Rol</Form.Label>
              <Form.Control
                type='text'
                name='role'
                value={formData.role}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>
          </Form>
          <div className='d-flex justify-content-between mt-4'>
            {isEditing ? (
              <>
                <Button variant='success' onClick={handleSaveChanges}>
                  Guardar Cambios
                </Button>
                <Button variant='secondary' onClick={handleEditToggle}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button variant='primary' onClick={handleEditToggle}>
                Editar Información
              </Button>
            )}
            <Button variant='danger' onClick={() => setShowDeleteModal(true)}>
              Eliminar Cuenta
            </Button>
          </div>
        </Col>
      </Row>

      {/* Modal de confirmación para eliminar la cuenta */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se
          puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={handleDeleteAccount}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default ProfileContent
