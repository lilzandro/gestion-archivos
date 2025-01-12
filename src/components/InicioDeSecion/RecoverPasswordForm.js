import React, { useState } from 'react'
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Toaster, toast } from 'react-hot-toast'

const RecoverPasswordForm = () => {
  const [cedula, setCedula] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [securityQuestions, setSecurityQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSecurityVerified, setIsSecurityVerified] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setCedula(e.target.value)
  }

  const handleAnswerChange = e => {
    setSecurityAnswer(e.target.value)
  }

  const handlePasswordChange = e => {
    setNewPassword(e.target.value)
  }

  const handleConfirmPasswordChange = e => {
    setConfirmPassword(e.target.value)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setUserInfo(null)

    try {
      const response = await axios.post('http://localhost:5000/recover', {
        cedula
      })

      setUserInfo(response.data.user)
      setSuccess('Usuario encontrado.')
      toast.success('Usuario encontrado.', { duration: 4000 })
      fetchSecurityQuestions(response.data.user.id)
    } catch (error) {
      setError(error.response?.data?.message || 'Error al buscar el usuario.')
      toast.error(
        error.response?.data?.message || 'Error al buscar el usuario.',
        { duration: 4000 }
      )
    }
  }

  const fetchSecurityQuestions = async userId => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/${userId}/security-questions`
      )
      setSecurityQuestions(response.data)
      const randomQuestion =
        response.data[Math.floor(Math.random() * response.data.length)]
      setSelectedQuestion(randomQuestion)
    } catch (err) {
      console.error('Error al obtener las preguntas de seguridad:', err)
      setError('Error al obtener las preguntas de seguridad')
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  const handleBackToCedula = () => {
    setUserInfo(null)
    setSelectedQuestion(null)
    setSecurityAnswer('')
    setError('')
    setSuccess('')
  }

  const handleSecurityAnswerSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(
        'http://localhost:5000/user/verify-security-answer',
        {
          questionId: selectedQuestion.id,
          answer: securityAnswer,
          userId: userInfo.id
        }
      )

      if (response.data.success) {
        setSuccess('Respuesta correcta. Ahora puede cambiar su contraseña.')
        toast.success(
          'Respuesta correcta. Ahora puede cambiar su contraseña.',
          { duration: 4000 }
        )
        setIsSecurityVerified(true)
      } else {
        setError('Respuesta incorrecta. Inténtelo de nuevo.')
        toast.error('Respuesta incorrecta. Inténtelo de nuevo.', {
          duration: 4000
        })
      }
    } catch (err) {
      console.error('Error al verificar la respuesta de seguridad:', err)
      setError('Error al verificar la respuesta de seguridad')
      toast.error('Error al verificar la respuesta de seguridad', {
        duration: 4000
      })
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    setError('')

    if (newPassword.length < 8 || newPassword.length > 20) {
      setError('La contraseña debe tener entre 8 y 20 caracteres.')
      toast.error('La contraseña debe tener entre 8 y 20 caracteres.', {
        duration: 4000
      })
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      toast.error('Las contraseñas no coinciden.', { duration: 4000 })
      return
    }

    try {
      await axios.put(
        `http://localhost:5000/user/${userInfo.id}/change-password`,
        {
          newPassword,
          userId: userInfo.id
        }
      )
      setIsSecurityVerified(false)
      localStorage.setItem(
        'passwordChangeSuccess',
        'Contraseña cambiada exitosamente'
      )
      toast.success('Contraseña cambiada exitosamente', { duration: 4000 })
      navigate('/login')
    } catch (err) {
      if (
        err.response &&
        err.response.data.message ===
          'La nueva contraseña no puede ser la misma que la actual'
      ) {
        setError('La nueva contraseña no puede ser la misma que la actual.')
        toast.error(
          'La nueva contraseña no puede ser la misma que la actual.',
          { duration: 4000 }
        )
      } else {
        console.error('Error al cambiar la contraseña:', err)
        setError('Error al cambiar la contraseña')
        toast.error('Error al cambiar la contraseña', { duration: 4000 })
      }
    }
  }

  const handleCancel = () => {
    navigate('/login')
  }

  return (
    <Container className='d-flex justify-content-center align-items-center vh-100'>
      <Toaster />
      <Card style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
        <h3 className='text-center'>Recuperar Contraseña</h3>
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
        {!userInfo && (
          <Form onSubmit={handleSubmit} className='mt-4'>
            <Form.Group controlId='cedula'>
              <Form.Label>Cédula</Form.Label>
              <Form.Control
                type='text'
                name='cedula'
                value={cedula}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-3'>
              Buscar Usuario
            </Button>
            <Button
              variant='secondary'
              onClick={handleBackToLogin}
              className='w-100 mt-3'
            >
              Volver al Inicio de Sesión
            </Button>
          </Form>
        )}
        {userInfo && selectedQuestion && !isSecurityVerified && (
          <Form onSubmit={handleSecurityAnswerSubmit} className='mt-4'>
            <h5>Información del Usuario</h5>
            <p>
              <strong>Nombre:</strong> {userInfo.nombre}
            </p>
            <p>
              <strong>Apellido:</strong> {userInfo.apellido}
            </p>
            <p>
              <strong>Usuario:</strong> {userInfo.username}
            </p>
            <Form.Group controlId='securityQuestion'>
              <Form.Label>{selectedQuestion.question}</Form.Label>
              <Form.Control
                type='text'
                name='securityAnswer'
                value={securityAnswer}
                onChange={handleAnswerChange}
                required
              />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-3'>
              Verificar Respuesta
            </Button>
            <Button
              variant='secondary'
              onClick={handleBackToCedula}
              className='w-100 mt-3'
            >
              Volver a Ingresar Cédula
            </Button>
          </Form>
        )}
        {isSecurityVerified && (
          <Form onSubmit={handleChangePassword} className='mt-4'>
            <Form.Group controlId='newPassword'>
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type='password'
                name='newPassword'
                value={newPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>
            <Form.Group controlId='confirmPassword' className='mt-3'>
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
              />
            </Form.Group>
            <Button variant='primary' type='submit' className='w-100 mt-3'>
              Cambiar Contraseña
            </Button>
            <Button
              variant='secondary'
              onClick={handleCancel}
              className='w-100 mt-3'
            >
              Cancelar
            </Button>
          </Form>
        )}
      </Card>
    </Container>
  )
}

export default RecoverPasswordForm
