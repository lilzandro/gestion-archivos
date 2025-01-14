import React from 'react'
import { Form, Row, Col, InputGroup } from 'react-bootstrap'

const RegisterForm = ({
  formData,
  handleChange,
  refs,
  cedulaError,
  usernameError,
  nombreError,
  apellidoError,
  passwordError,
  confirmPasswordError
}) => (
  <>
    <Row>
      <Col md={6}>
        <Form.Group className='mb-3' controlId='formNombre'>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu nombre'
            name='nombre'
            value={formData.nombre}
            onChange={handleChange}
            ref={refs.nombreRef}
            isInvalid={!!nombreError}
            required
          />
          <Form.Control.Feedback type='invalid'>
            {nombreError}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col md={6}>
        <Form.Group className='mb-3' controlId='formApellido'>
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type='text'
            placeholder='Ingresa tu apellido'
            name='apellido'
            value={formData.apellido}
            onChange={handleChange}
            ref={refs.apellidoRef}
            isInvalid={!!apellidoError}
            required
          />
          <Form.Control.Feedback type='invalid'>
            {apellidoError}
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
    </Row>
    <Form.Group className='mb-3' controlId='formCedula'>
      <Form.Label>Cédula</Form.Label>
      <InputGroup>
        <InputGroup.Text>V-</InputGroup.Text>
        <Form.Control
          type='text'
          placeholder='Ingresa tu cédula'
          name='cedula'
          value={formData.cedula}
          onChange={handleChange}
          ref={refs.cedulaRef}
          isInvalid={cedulaError}
          required
        />
        <Form.Control.Feedback type='invalid'>
          {cedulaError}
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
    <Form.Group className='mb-3' controlId='formUsername'>
      <Form.Label>Nombre de Usuario</Form.Label>
      <Form.Control
        type='text'
        placeholder='Ingresa tu nombre de usuario'
        name='username'
        value={formData.username}
        onChange={handleChange}
        ref={refs.usernameRef}
        isInvalid={usernameError}
        required
      />
      <Form.Control.Feedback type='invalid'>
        {usernameError}
      </Form.Control.Feedback>
    </Form.Group>
    <Form.Group className='mb-3' controlId='formPassword'>
      <Form.Label>Contraseña</Form.Label>
      <Form.Control
        type='password'
        placeholder='Ingresa tu contraseña'
        name='password'
        value={formData.password}
        onChange={handleChange}
        ref={refs.passwordRef}
        isInvalid={!!passwordError}
        required
      />
      <Form.Control.Feedback type='invalid'>
        {passwordError}
      </Form.Control.Feedback>
    </Form.Group>
    <Form.Group className='mb-3' controlId='formConfirmPassword'>
      <Form.Label>Confirmar Contraseña</Form.Label>
      <Form.Control
        type='password'
        placeholder='Confirma tu contraseña'
        name='confirmPassword'
        value={formData.confirmPassword}
        onChange={handleChange}
        ref={refs.confirmPasswordRef}
        isInvalid={!!confirmPasswordError}
        required
      />
      <Form.Control.Feedback type='invalid'>
        {confirmPasswordError}
      </Form.Control.Feedback>
    </Form.Group>
  </>
)

export default RegisterForm
