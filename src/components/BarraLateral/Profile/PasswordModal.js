import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const PasswordModal = ({
  show,
  onHide,
  newPassword,
  confirmPassword,
  handleNewPasswordChange,
  handleConfirmPasswordChange,
  handleChangePassword
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type='password'
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
            <Form.Control
              type='password'
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handleChangePassword}>
          Cambiar Contraseña
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PasswordModal
