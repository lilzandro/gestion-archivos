import React from 'react'
import { Form, Row, Col, Alert, Button } from 'react-bootstrap'

const SecurityQuestions = ({
  formData,
  handleChange,
  securityError,
  setShowSecurityQuestions
}) => (
  <>
    <Alert variant='info'>
      Las preguntas de seguridad son clave para recuperar tu cuenta si olvidas
      tu contraseña. Por favor, proporciona respuestas que puedas recordar
      fácilmente y asegúrate de no perderlas, ya que son esenciales para acceder
      a tu cuenta en caso de emergencia.
    </Alert>
    {securityError && (
      <Alert variant='danger' className='mt-3'>
        {securityError}
      </Alert>
    )}
    <Row>
      <Col xs={12} md={6}>
        <Form.Group className='mb-3' controlId='formSecurityQuestion1'>
          <Form.Label>Pregunta de Seguridad 1</Form.Label>
          <Form.Control
            type='text'
            value='¿Cuál es el nombre de tu primera mascota?'
            readOnly
          />
        </Form.Group>
      </Col>
      <Col xs={12} md={6}>
        <Form.Group className='mb-3' controlId='formSecurityAnswer1'>
          <Form.Label>Respuesta 1</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu respuesta 1'
            name='securityAnswer1'
            value={formData.securityAnswer1}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col xs={12} md={6}>
        <Form.Group className='mb-3' controlId='formSecurityQuestion2'>
          <Form.Label>Pregunta de Seguridad 2</Form.Label>
          <Form.Control
            type='text'
            value='¿Cuál es el nombre de tu mejor amigo de la infancia?'
            readOnly
          />
        </Form.Group>
      </Col>
      <Col xs={12} md={6}>
        <Form.Group className='mb-3' controlId='formSecurityAnswer2'>
          <Form.Label>Respuesta 2</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu respuesta 2'
            name='securityAnswer2'
            value={formData.securityAnswer2}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col xs={12} md={6}>
        <Form.Group className='mb-3' controlId='formSecurityQuestion3'>
          <Form.Label>Pregunta de Seguridad 3</Form.Label>
          <Form.Control
            type='text'
            value='¿Cuál es tu comida favorita?'
            readOnly
          />
        </Form.Group>
      </Col>
      <Col xs={12} md={6}>
        <Form.Group className='mb-3' controlId='formSecurityAnswer3'>
          <Form.Label>Respuesta 3</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu respuesta 3'
            name='securityAnswer3'
            value={formData.securityAnswer3}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
    </Row>
    <Button
      variant='secondary'
      onClick={() => setShowSecurityQuestions(false)}
      className='w-100 mb-3'
    >
      Regresar
    </Button>
  </>
)

export default SecurityQuestions
