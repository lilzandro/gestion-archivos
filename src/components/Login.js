import React, { useState } from 'react'
import {
  Form,
  Button,
  Container,
  Card,
  Alert,
  Row,
  Col,
  InputGroup
} from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from './UserContext' // Importar el contexto

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
    cedula: '',
    securityAnswer1: '',
    securityAnswer2: '',
    securityAnswer3: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { setUser } = useUser() // Obtener `setUser` del contexto
  const navigate = useNavigate() // Hook para navegación

  const toggleForm = () => {
    setError('')
    setSuccess('')
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellido: '',
      cedula: '',
      securityAnswer1: '',
      securityAnswer2: '',
      securityAnswer3: ''
    })
    setIsLogin(!isLogin)
    setShowSecurityQuestions(false)
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const {
      username,
      password,
      confirmPassword,
      nombre,
      apellido,
      cedula,
      securityAnswer1,
      securityAnswer2,
      securityAnswer3
    } = formData

    // Validaciones
    const nameRegex = /^[a-zA-Z]+$/
    const cedulaRegex = /^[0-9]+$/
    const securityAnswerRegex = /^[a-zA-Z\s]+$/

    if (!isLogin) {
      if (!nameRegex.test(nombre) || !nameRegex.test(apellido)) {
        setError('El nombre y el apellido solo deben contener letras.')
        return
      }

      if (!cedulaRegex.test(cedula)) {
        setError('La cédula solo debe contener números.')
        return
      }

      if (showSecurityQuestions) {
        if (
          !securityAnswerRegex.test(securityAnswer1) ||
          !securityAnswerRegex.test(securityAnswer2) ||
          !securityAnswerRegex.test(securityAnswer3)
        ) {
          setError(
            'Las respuestas de seguridad solo deben contener letras y espacios.'
          )
          return
        }
      }

      if (password.length < 8 || password !== confirmPassword) {
        setError(
          password.length < 8
            ? 'La contraseña debe tener al menos 8 caracteres.'
            : 'Las contraseñas no coinciden.'
        )
        return
      }
    }

    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          username,
          password
        })
        setUser(response.data.user) // Guardar datos del usuario en el contexto
        const { token, user } = response.data
        localStorage.setItem('token', token)
        localStorage.setItem('userId', user.id)
        localStorage.setItem('user', JSON.stringify(user)) // Guardar el token en localStorage
        setSuccess(response.data.message)
        onLogin(response.data.user) // Actualizar estado en el componente padre
        navigate('/dashboard') // Redirigir al dashboard
      } catch (error) {
        setError(error.response?.data?.message || 'Error al iniciar sesión.')
      }
    } else {
      if (!showSecurityQuestions) {
        setShowSecurityQuestions(true)
        return
      }

      try {
        const response = await axios.post('http://localhost:5000/register', {
          username,
          password,
          nombre,
          apellido,
          cedula,
          securityAnswer1,
          securityAnswer2,
          securityAnswer3
        })

        const { user, token } = response.data
        setUser(user) // Guardar datos del usuario en el contexto
        localStorage.setItem('token', token) // Guardar el token en localStorage
        localStorage.setItem('userId', user.id) // Guardar el ID del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user)) // Guardar el usuario en localStorage
        setSuccess(response.data.message)
        onLogin(user) // Actualizar estado en el componente padre
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
          minWidth: showSecurityQuestions ? '300px' : '300px',
          maxWidth: showSecurityQuestions ? '800px' : '400px',
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
              {!isLogin && !showSecurityQuestions && (
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
                    <InputGroup>
                      <InputGroup.Text>V-</InputGroup.Text>
                      <Form.Control
                        type='text'
                        placeholder='Ingresa tu cédula'
                        name='cedula'
                        value={formData.cedula}
                        onChange={handleChange}
                        required
                      />
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
                </>
              )}
              {!isLogin && showSecurityQuestions && (
                <>
                  <Alert variant='info'>
                    Las preguntas de seguridad se utilizan para recuperar tu
                    cuenta en caso de que olvides tu contraseña. Por favor,
                    proporciona respuestas que puedas recordar fácilmente.
                  </Alert>
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group
                        className='mb-3'
                        controlId='formSecurityQuestion1'
                      >
                        <Form.Label>Pregunta de Seguridad 1</Form.Label>
                        <Form.Control
                          type='text'
                          value='¿Cuál es el nombre de tu primera mascota?'
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group
                        className='mb-3'
                        controlId='formSecurityAnswer1'
                      >
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
                      <Form.Group
                        className='mb-3'
                        controlId='formSecurityQuestion2'
                      >
                        <Form.Label>Pregunta de Seguridad 2</Form.Label>
                        <Form.Control
                          type='text'
                          value='¿Cuál es el nombre de tu mejor amigo de la infancia?'
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group
                        className='mb-3'
                        controlId='formSecurityAnswer2'
                      >
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
                      <Form.Group
                        className='mb-3'
                        controlId='formSecurityQuestion3'
                      >
                        <Form.Label>Pregunta de Seguridad 3</Form.Label>
                        <Form.Control
                          type='text'
                          value='¿Cuál es tu comida favorita?'
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group
                        className='mb-3'
                        controlId='formSecurityAnswer3'
                      >
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
              )}
              {isLogin && (
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
              )}
              <Button variant='primary' type='submit' className='w-100'>
                {isLogin
                  ? 'Ingresar'
                  : showSecurityQuestions
                  ? 'Registrarse'
                  : 'Siguiente'}
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
