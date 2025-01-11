import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const PasswordModal = ({
  show,
  onHide,
  securityQuestion,
  securityAnswer,
  handleSecurityAnswerChange,
  handlePasswordChange
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Para cambiar la contraseña, por favor responde la siguiente pregunta
          de seguridad:
        </p>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>{securityQuestion}</Form.Label>
            <Form.Control
              type='text'
              value={securityAnswer}
              onChange={handleSecurityAnswerChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handlePasswordChange}>
          Verificar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PasswordModal
