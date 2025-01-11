import React, { useState, useRef } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../UserContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import SecurityQuestions from './PreguntasDeSeguridad'

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
  const { setUser } = useUser()
  const navigate = useNavigate()

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
      try {
        const response = await axios.post('http://localhost:5000/login', {
          username: formData.username,
          password: formData.password
        })

        const { user, token } = response.data
        setUser(user)
        localStorage.setItem('token', token)
        localStorage.setItem('userId', user.id)
        localStorage.setItem('user', JSON.stringify(user))
        setSuccess('Inicio de sesión exitoso')
        onLogin(user)
        navigate('/dashboard')
      } catch (error) {
        setError(error.response?.data?.message || 'Error al iniciar sesión.')
      }
    } else {
      if (!showSecurityQuestions) {
        if (validateFormData()) {
          setShowSecurityQuestions(true)
        } else {
          setShowSecurityQuestions(false)
        }
        return
      }

      if (!validateFormData() || !validateSecurityAnswers()) {
        setShowSecurityQuestions(true)
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
        setUser(user)
        localStorage.setItem('token', token)
        localStorage.setItem('userId', user.id)
        localStorage.setItem('user', JSON.stringify(user))
        setSuccess(response.data.message)
        onLogin(user)
        navigate('/dashboard')
      } catch (error) {
        setError(
          error.response?.data?.message || 'Error al registrar el usuario.'
        )
        setShowSecurityQuestions(false)
      }
    }
  }

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
              {isLogin && (
                <LoginForm formData={formData} handleChange={handleChange} />
              )}
              {!isLogin && !showSecurityQuestions && (
                <RegisterForm
                  formData={formData}
                  handleChange={handleChange}
                  refs={{
                    nombreRef,
                    apellidoRef,
                    cedulaRef,
                    passwordRef,
                    confirmPasswordRef
                  }}
                />
              )}
              {!isLogin && showSecurityQuestions && (
                <SecurityQuestions
                  formData={formData}
                  handleChange={handleChange}
                  securityError={securityError}
                  setShowSecurityQuestions={setShowSecurityQuestions}
                />
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
