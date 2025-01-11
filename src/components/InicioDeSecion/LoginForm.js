import React from 'react'
import { Form } from 'react-bootstrap'

const LoginForm = ({ formData, handleChange }) => (
  <>
    <Form.Group className='mb-3' controlId='formUsername'>
      <Form.Label>Nombre de Usuario</Form.Label>
      <Form.Control
        type='text'
        placeholder='Ingresa tu nombre de usuario'
        name='username'
        value={formData.username}
        onChange={handleChange}
        required
      />
    </Form.Group>
    <Form.Group className='mb-3' controlId='formPassword'>
      <Form.Label>Contraseña</Form.Label>
      <Form.Control
        type='password'
        placeholder='Ingresa tu contraseña'
        name='password'
        value={formData.password}
        onChange={handleChange}
        required
      />
    </Form.Group>
  </>
)

export default LoginForm
