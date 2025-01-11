import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const SecurityQuestionModal = ({
  show,
  onHide,
  question,
  securityAnswer,
  handleSecurityAnswerChange,
  handlePasswordChange
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Pregunta de Seguridad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Para cambiar la contraseña, por favor responde la siguiente pregunta
          de seguridad:
        </p>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Pregunta de Seguridad</Form.Label>
            <Form.Control type='text' value={question || ''} readOnly />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Respuesta</Form.Label>
            <Form.Control
              type='text'
              value={securityAnswer || ''}
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
          Verificar Respuesta
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default SecurityQuestionModal
