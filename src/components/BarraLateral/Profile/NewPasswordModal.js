import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const NewPasswordModal = ({
  show,
  onHide,
  newPassword,
  setNewPassword,
  handleNewPasswordChange
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Nueva Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handleNewPasswordChange}>
          Cambiar Contraseña
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default NewPasswordModal
