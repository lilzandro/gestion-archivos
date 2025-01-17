import React, { useState, useRef, useEffect } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../UserContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import SecurityQuestions from './PreguntasDeSeguridad'
import { Toaster, toast } from 'react-hot-toast'

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false)
  const [showRecoverPassword, setShowRecoverPassword] = useState(false) // Nuevo estado
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

  //MANEJO DE ESTADO DE LOS ERROES Y EXITOS
  const [error, setError] = useState('')
  const [securityError, setSecurityError] = useState('')
  const [success, setSuccess] = useState('')
  const [cedulaError, setCedulaError] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [nombreError, setNombreError] = useState('')
  const [apellidoError, setApellidoError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [securityAnswer1Error, setSecurityAnswer1Error] = useState('')
  const [securityAnswer2Error, setSecurityAnswer2Error] = useState('')
  const [securityAnswer3Error, setSecurityAnswer3Error] = useState('')

  const { setUser } = useUser()
  const navigate = useNavigate()

  const nombreRef = useRef(null)
  const apellidoRef = useRef(null)
  const cedulaRef = useRef(null)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)

  useEffect(() => {
    const passwordChangeSuccess = localStorage.getItem('passwordChangeSuccess')
    if (passwordChangeSuccess) {
      toast.success(passwordChangeSuccess)
      localStorage.removeItem('passwordChangeSuccess')
    }
  }, [])

  const toggleForm = () => {
    setError('')
    setSecurityError('')
    setSuccess('')
    setCedulaError('') // Resetear el estado
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
    setShowRecoverPassword(false) // Resetear el estado
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateFormData = () => {
    const { password, confirmPassword, nombre, apellido, cedula, username } =
      formData

    const nameRegex = /^[a-zA-Z]+$/
    const cedulaRegex = /^[0-9]+$/
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,20}$/

    if (!nameRegex.test(nombre) || nombre.length < 3 || nombre.length > 15) {
      setError('El nombre debe contener entre 3 y 15 caracteres alfabeticos.')
      setNombreError(' ')
      nombreRef.current.focus()
      return false
    } else {
      setNombreError('')
    }

    if (
      !nameRegex.test(apellido) ||
      apellido.length < 3 ||
      apellido.length > 15
    ) {
      setError('El apellido debe contener entre 3 y 15 caracteres alfabeticos.')
      setApellidoError(' ')
      apellidoRef.current.focus()
      return false
    } else {
      setApellidoError('')
    }

    if (!cedulaRegex.test(cedula) || cedula.length < 7 || cedula.length > 15) {
      setError('La cédula debe contener entre 7 y 15 caracteres numéricos.')
      cedulaRef.current.focus()
      return false
    }

    if (username.length < 5 || username.length > 20) {
      setError(
        'El nombre de usuario debe tener entre 5 y 20 caracteres alphanuméricos.'
      )
      setUsernameError(' ')
      return false
    } else {
      setUsernameError('')
    }

    if (password.length < 8 || password.length > 20) {
      setPasswordError('La contraseña debe tener entre 8 y 20 caracteres.')
      passwordRef.current.focus()
      return false
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'La contraseña debe tener al menos un número y un carácter especial (signos de puntuacion y  numeros).'
      )
      passwordRef.current.focus()
      return false
    } else {
      setPasswordError('')
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.')
      confirmPasswordRef.current.focus()
      return false
    } else {
      setConfirmPasswordError('')
    }

    return true
  }

  const validateSecurityAnswers = () => {
    const answerRegex = /^[a-zA-Z]{3,20}$/
    const { securityAnswer1, securityAnswer2, securityAnswer3 } = formData

    if (!answerRegex.test(securityAnswer1)) {
      setSecurityAnswer1Error(
        'La respuesta debe tener entre 3 y 20 caracteres alfabéticos.'
      )
      return false
    } else {
      setSecurityAnswer1Error('')
    }

    if (!answerRegex.test(securityAnswer2)) {
      setSecurityAnswer2Error(
        'La respuesta debe tener entre 3 y 20 caracteres alfabéticos.'
      )
      return false
    } else {
      setSecurityAnswer2Error('')
    }

    if (!answerRegex.test(securityAnswer3)) {
      setSecurityAnswer3Error(
        'La respuesta debe tener entre 3 y 20 caracteres alfabéticos.'
      )
      return false
    } else {
      setSecurityAnswer3Error('')
    }

    return true
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSecurityError('')
    setSuccess('')
    setCedulaError('')
    setUsernameError('') // Resetear el estado

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
        if (error.response?.data?.code === 'DUPLICATE_CEDULA') {
          setCedulaError('La cédula ya está registrada')
        } else if (error.response?.data?.code === 'DUPLICATE_USERNAME') {
          setUsernameError('El nombre de usuario ya está registrado')
        } else {
          setError(
            error.response?.data?.message || 'Error al registrar el usuario.'
          )
        }
        setShowSecurityQuestions(false)
      }
    }
  }

  const handleRecoverPassword = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        'http://localhost:5000/recover-password',
        {
          cedula: formData.cedula,
          newPassword: formData.password
        }
      )

      setSuccess(response.data.message)
      setShowRecoverPassword(false)
    } catch (error) {
      setError(
        error.response?.data?.message || 'Error al recuperar la contraseña.'
      )
    }
  }

  const handleForgotPassword = () => {
    navigate('/recover-password')
  }

  const formVariants = {
    initial: { opacity: 0, x: isLogin ? 100 : -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? -100 : 100 }
  }

  return (
    <Container className='d-flex justify-content-center align-items-center vh-100'>
      <Toaster />
      <Card
        style={{
          width: '100%',
          minWidth: showSecurityQuestions ? '300px' : '300px',
          maxWidth: showSecurityQuestions ? '800px' : '400px',
          padding: '20px'
        }}
      >
        <img
          src='Logo-unellez.png'
          alt='Logo'
          className='mb-4 mx-auto d-block'
          style={{ width: '100px', height: '100px', objectFit: 'contain' }}
        />
        <AnimatePresence mode='wait'>
          <motion.div
            key={
              isLogin ? 'login' : showRecoverPassword ? 'recover' : 'register'
            }
            variants={formVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            transition={{ duration: 0.5 }}
          >
            <h3 className='text-center'>
              {isLogin
                ? 'Iniciar Sesión'
                : showRecoverPassword
                ? 'Recuperar Contraseña'
                : 'Registrar Usuario'}
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
            <Form
              onSubmit={
                isLogin
                  ? handleSubmit
                  : showRecoverPassword
                  ? handleRecoverPassword
                  : handleSubmit
              }
              className='mt-4'
            >
              {isLogin && (
                <LoginForm formData={formData} handleChange={handleChange} />
              )}
              {!isLogin && !showSecurityQuestions && !showRecoverPassword && (
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
                  cedulaError={cedulaError}
                  usernameError={usernameError}
                  nombreError={nombreError}
                  apellidoError={apellidoError}
                  passwordError={passwordError}
                  confirmPasswordError={confirmPasswordError}
                />
              )}
              {!isLogin && showSecurityQuestions && (
                <SecurityQuestions
                  formData={formData}
                  handleChange={handleChange}
                  securityError={securityError}
                  setShowSecurityQuestions={setShowSecurityQuestions}
                  securityAnswer1Error={securityAnswer1Error}
                  securityAnswer2Error={securityAnswer2Error}
                  securityAnswer3Error={securityAnswer3Error}
                />
              )}
              <Button variant='primary' type='submit' className='w-100'>
                {isLogin
                  ? 'Ingresar'
                  : showRecoverPassword
                  ? 'Recuperar Contraseña'
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
              {isLogin && (
                <Button
                  variant='link'
                  onClick={handleForgotPassword}
                  className='text-decoration-none'
                >
                  ¿Olvidaste tu contraseña?
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </Container>
  )
}

export default AuthForm
