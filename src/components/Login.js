import React, { useState } from 'react'
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from './UserContext' // Importar el contexto

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    cedula: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { setUser } = useUser() // Obtener `setUser` del contexto
  const navigate = useNavigate() // Hook para navegación

  const toggleForm = () => {
    setError('')
    setSuccess('')
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      cedula: ''
    })
    setIsLogin(!isLogin)
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { email, password, confirmPassword, nombre, apellido, cedula } =
      formData

    if (!validateEmail(email)) {
      setError('Ingresa un correo válido.')
      return
    }

    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          email,
          password
        })
        setUser(response.data.user) // Guardar datos del usuario en el contexto
        setSuccess(response.data.message)
        onLogin(response.data.user) // Actualizar estado en el componente padre
        navigate('/dashboard') // Redirigir al dashboard
      } catch (error) {
        setError(error.response?.data?.message || 'Error al iniciar sesión.')
      }
    } else {
      if (password.length < 8 || password !== confirmPassword) {
        setError(
          password.length < 8
            ? 'La contraseña debe tener al menos 8 caracteres.'
            : 'Las contraseñas no coinciden.'
        )
        return
      }

      try {
        const response = await axios.post('http://localhost:5000/register', {
          email,
          password,
          nombre,
          apellido,
          cedula
        })
        setUser(response.data.user) // Guardar datos del usuario en el contexto
        setSuccess(response.data.message)
        onLogin(response.data.user) // Actualizar estado en el componente padre
        navigate('/dashboard') // Redirigir al dashboard
      } catch (error) {
        setError(
          error.response?.data?.message || 'Error al registrar el usuario.'
        )
      }
    }
  }

  // Animaciones
  const formVariants = {
    initial: { opacity: 0, x: isLogin ? 100 : -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? -100 : 100 }
  }

  return (
    <Container className='d-flex justify-content-center align-items-center vh-100'>
      <Card
        style={{
          width: '100%',
          minWidth: '350px',
          maxWidth: '25em',
          padding: '20px'
        }}
      >
        <AnimatePresence mode='wait'>
          <motion.div
            key={isLogin ? 'login' : 'register'}
            variants={formVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{ duration: 0.5 }}
          >
            <h3 className='text-center'>
              {isLogin ? 'Iniciar Sesión' : 'Registrar Usuario'}
            </h3>
            {error && (
              <Alert variant='danger' className='mt-3'>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant='success' className='mt-3'>
                {success}
              </Alert>
            )}
            <Form onSubmit={handleSubmit} className='mt-4'>
              {!isLogin && (
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
                          required
                        />
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
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className='mb-3' controlId='formCedula'>
                    <Form.Label>Cédula</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Ingresa tu cédula'
                      name='cedula'
                      value={formData.cedula}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </>
              )}
              <Form.Group className='mb-3' controlId='formEmail'>
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Ingresa tu correo'
                  name='email'
                  value={formData.email}
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
              {!isLogin && (
                <Form.Group className='mb-3' controlId='formConfirmPassword'>
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirma tu contraseña'
                    name='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              )}
              <Button variant='primary' type='submit' className='w-100'>
                {isLogin ? 'Ingresar' : 'Registrarse'}
              </Button>
            </Form>
            <div className='text-center mt-3'>
              <Button
                variant='link'
                onClick={toggleForm}
                className='text-decoration-none'
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </Container>
  )
}

export default AuthForm
