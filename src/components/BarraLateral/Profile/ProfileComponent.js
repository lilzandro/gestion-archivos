import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Button, Image, Row, Col, Spinner } from 'react-bootstrap'
import { Toaster, toast } from 'react-hot-toast'
import EditModal from './EditModal'
import PasswordModal from './PasswordModal'
import SecurityQuestionModal from './SecurityQuestionModal'

const ProfileComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showSecurityQuestionModal, setShowSecurityQuestionModal] =
    useState(false)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [securityQuestions, setSecurityQuestions] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`)
        setUserData(response.data)
        setEditedData(response.data)
      } catch (err) {
        setError('Error al obtener datos del usuario.')
        console.error('Error al obtener datos del usuario:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleEditChange = e => {
    const { name, value } = e.target
    setEditedData({ ...editedData, [name]: value })
  }

  const validateData = () => {
    const { nombre, apellido, cedula } = editedData
    const nameRegex = /^[a-zA-Z\s]{1,50}$/
    const cedulaRegex = /^\d{1,10}$/

    if (!nameRegex.test(nombre)) {
      return 'El nombre debe contener solo letras y tener un máximo de 50 caracteres.'
    }
    if (!nameRegex.test(apellido)) {
      return 'El apellido debe contener solo letras y tener un máximo de 50 caracteres.'
    }
    if (!cedulaRegex.test(cedula)) {
      return 'La cédula debe contener solo números y tener un máximo de 10 dígitos.'
    }
    return null
  }

  const handleSaveChanges = async () => {
    const validationError = validateData()
    if (validationError) {
      toast.error(validationError)
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:5000/user/${userId}`, editedData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserData(editedData)
      setShowEditModal(false)
      toast.success('Información del usuario actualizada exitosamente')
    } catch (err) {
      console.error('Error al guardar los cambios:', err)
      toast.error('Error al guardar los cambios')
    }
  }

  const handleSecurityAnswerChange = e => {
    setSecurityAnswer(e.target.value)
  }

  const handleNewPasswordChange = e => {
    setNewPassword(e.target.value)
  }

  const handleConfirmPasswordChange = e => {
    setConfirmPassword(e.target.value)
  }

  const handlePasswordChange = async () => {
    const userId = localStorage.getItem('userId')

    try {
      const response = await axios.post(
        `http://localhost:5000/user/verify-security-answer`,
        { questionId: selectedQuestion.id, answer: securityAnswer, userId }
      )

      if (response.data.success) {
        setShowSecurityQuestionModal(false)
        setShowPasswordModal(true)
      } else {
        toast.error('Respuesta de seguridad incorrecta')
      }
    } catch (err) {
      console.error('Error al verificar la respuesta de seguridad:', err)
      toast.error('Error al verificar la respuesta de seguridad')
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    try {
      await axios.put(`http://localhost:5000/user/${userId}/change-password`, {
        newPassword,
        userId
      })
      toast.success('Contraseña cambiada exitosamente')
      setShowPasswordModal(false)
      setNewPassword('') // Limpiar el campo de nueva contraseña
      setConfirmPassword('') // Limpiar el campo de confirmación de contraseña
      setSecurityAnswer('') // Limpiar el campo de respuesta de seguridad
      setSelectedQuestion(null) // Limpiar la pregunta de seguridad seleccionada
    } catch (err) {
      toast.error('La nueva contraseña no puede ser la misma que la actual')
    }
  }

  const fetchSecurityQuestions = async () => {
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
      toast.error('Error al obtener las preguntas de seguridad')
    }
  }

  if (loading) {
    return (
      <div className='d-flex justify-content-center mt-5'>
        <Spinner animation='border' variant='primary' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-center mt-5 text-danger'>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className='profile-content'>
      <Toaster />
      <Row className='mb-4 justify-content-center'>
        <Col md={8} lg={6}>
          <Card
            className='profile-card shadow-lg'
            style={{ borderRadius: '15px', backgroundColor: '#f9f9f9' }}
          >
            <Card.Body className='text-center'>
              <div
                className='profile-avatar-wrapper'
                style={{ marginBottom: '20px' }}
              >
                <Image
                  src='/user.png'
                  roundedCircle
                  width={150}
                  height={150}
                  alt='Foto de perfil'
                  style={{ border: '5px solid #007bff', padding: '5px' }}
                />
              </div>
              <h5
                className='mt-3 profile-name'
                style={{ fontWeight: 'bold', color: '#333' }}
              >
                {userData.nombre} {userData.apellido}
              </h5>
              <p
                className='text-muted profile-role'
                style={{ fontStyle: 'italic', color: '#555' }}
              >
                <strong>Rol:</strong> {userData.role}
              </p>
              <p
                className='text-muted profile-info'
                style={{ fontSize: '14px', color: '#666' }}
              >
                <strong>Cédula:</strong> {userData.cedula}
              </p>
              <p
                className='text-muted profile-info'
                style={{ fontSize: '14px', color: '#666' }}
              >
                <strong>Nombre de usuario:</strong> {userData.username}
              </p>
              <Button
                variant='primary'
                className='mt-3'
                style={{
                  marginRight: '10px',
                  borderRadius: '10px',
                  padding: '10px 20px'
                }}
                onClick={() => setShowEditModal(true)}
              >
                Editar Información
              </Button>
              <Button
                variant='secondary'
                className='mt-3'
                style={{
                  borderRadius: '10px',
                  padding: '10px 20px'
                }}
                onClick={() => {
                  fetchSecurityQuestions()
                  setShowSecurityQuestionModal(true)
                }}
              >
                Cambiar Contraseña
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <EditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        editedData={editedData}
        handleEditChange={handleEditChange}
        handleSaveChanges={handleSaveChanges}
      />

      <SecurityQuestionModal
        show={showSecurityQuestionModal}
        onHide={() => setShowSecurityQuestionModal(false)}
        question={selectedQuestion?.question}
        securityAnswer={securityAnswer}
        handleSecurityAnswerChange={handleSecurityAnswerChange}
        handlePasswordChange={handlePasswordChange}
      />

      <PasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        handleNewPasswordChange={handleNewPasswordChange}
        handleConfirmPasswordChange={handleConfirmPasswordChange}
        handleChangePassword={handleChangePassword}
      />
    </div>
  )
}

export default ProfileComponent
