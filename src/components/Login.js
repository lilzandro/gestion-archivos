import React, { useState, useRef } from 'react'
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
  const [securityError, setSecurityError] = useState('')
  const [success, setSuccess] = useState('')
  const { setUser } = useUser() // Obtener `setUser` del contexto
  const navigate = useNavigate() // Hook para navegación

  // Crear referencias para los campos del formulario
  const nombreRef = useRef(null)
  const apellidoRef = useRef(null)
  const cedulaRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  const toggleForm = () => {
    setError('')
    setSecurityError('')
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

  const validateFormData = () => {
    const { password, confirmPassword, nombre, apellido, cedula, username } =
      formData

    const nameRegex = /^[a-zA-Z]+$/
    const cedulaRegex = /^[0-9]+$/

    if (!nameRegex.test(nombre) || nombre.length < 3 || nombre.length > 15) {
      setError('El nombre debe contener entre 3 y 15 caracteres alfabeticos.')
      nombreRef.current.focus()
      return false
    }

    if (
      !nameRegex.test(apellido) ||
      apellido.length < 5 ||
      apellido.length > 15
    ) {
      setError('El apellido debe contener entre 5 y 15 caracteres alfabeticos.')
      apellidoRef.current.focus()
      return false
    }

    if (!cedulaRegex.test(cedula) || cedula.length < 7 || cedula.length > 15) {
      setError('La cédula debe contener entre 7 y 15 caracteres.')
      cedulaRef.current.focus()
      return false
    }

    if (username.length < 6 || username.length > 20) {
      setError('El nombre de usuario debe tener entre 6 y 20 caracteres.')
      return false
    }

    if (password.length < 8 || password.length > 20) {
      setError('La contraseña debe tener entre 8 y 20 caracteres.')
      passwordRef.current.focus()
      return false
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      confirmPasswordRef.current.focus()
      return false
    }

    return true
  }

  const validateSecurityAnswers = () => {
    const answerRegex = /^[a-zA-Z]{3,20}$/
    const { securityAnswer1, securityAnswer2, securityAnswer3 } = formData

    if (!answerRegex.test(securityAnswer1)) {
      setSecurityError(
        'La respuesta 1 debe contener entre 3 y 20 caracteres alfabéticos.'
      )
      return false
    }

    if (!answerRegex.test(securityAnswer2)) {
      setSecurityError(
        'La respuesta 2 debe contener entre 3 y 20 caracteres alfabéticos.'
      )
      return false
    }

    if (!answerRegex.test(securityAnswer3)) {
      setSecurityError(
        'La respuesta 3 debe contener entre 3 y 20 caracteres alfabéticos.'
      )
      return false
    }

    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSecurityError('')
    setSuccess('')

    if (isLogin) {
      // ...existing code...
    } else {
      if (!showSecurityQuestions) {
        if (validateFormData()) {
          setShowSecurityQuestions(true)
        } else {
          setShowSecurityQuestions(false) // Forzar regreso al formulario inicial si hay errores
        }
        return
      }

      if (!validateFormData() || !validateSecurityAnswers()) {
        setShowSecurityQuestions(true) // Mantener en el formulario de preguntas de seguridad si hay errores
        return
      }

      try {
        const response = await axios.post('http://localhost:5000/register', {
          username: formData.username,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          cedula: formData.cedula,
          securityAnswers: [
            {
              question: '¿Cuál es el nombre de tu primera mascota?',
              answer: formData.securityAnswer1
            },
            {
              question: '¿Cuál es el nombre de tu mejor amigo de la infancia?',
              answer: formData.securityAnswer2
            },
            {
              question: '¿Cuál es tu comida favorita?',
              answer: formData.securityAnswer3
            }
          ]
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
        setShowSecurityQuestions(false) // Regresar al formulario inicial si hay errores
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
                          ref={nombreRef} // Asignar referencia
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
                          ref={apellidoRef} // Asignar referencia
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
                        ref={cedulaRef} // Asignar referencia
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
                      ref={passwordRef} // Asignar referencia
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
                      ref={confirmPasswordRef} // Asignar referencia
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
                  {securityError && (
                    <Alert variant='danger' className='mt-3'>
                      {securityError}
                    </Alert>
                  )}
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
