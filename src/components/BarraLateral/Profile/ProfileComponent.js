import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Button, Image, Row, Col, Spinner } from 'react-bootstrap'
import { Toaster, toast } from 'react-hot-toast'
import EditModal from './EditModal'
import PasswordModal from './PasswordModal'
import NewPasswordModal from './NewPasswordModal'

const ProfileComponent = ({ userId }) => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false)
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')

  const securityQuestions = [
    { id: 1, question: '¿Cuál es el nombre de tu primera mascota?' },
    { id: 2, question: '¿Cuál es el nombre de tu amigo de la infancia?' },
    { id: 3, question: '¿Cuál es tu comida favorita?' }
  ]

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

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `http://localhost:5000/user/verify-security-answer`,
        { questionId: securityQuestion.id, answer: securityAnswer },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (response.data.success) {
        setShowPasswordModal(false)
        setShowNewPasswordModal(true)
      } else {
        toast.error('Respuesta de seguridad incorrecta')
      }
    } catch (err) {
      console.error('Error al verificar la respuesta de seguridad:', err)
      toast.error('Error al verificar la respuesta de seguridad')
    }
  }

  const handleNewPasswordChange = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:5000/user/${userId}/change-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('Contraseña cambiada exitosamente')
      setShowNewPasswordModal(false)
    } catch (err) {
      console.error('Error al cambiar la contraseña:', err)
      toast.error('Error al cambiar la contraseña')
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
                  const randomQuestion =
                    securityQuestions[
                      Math.floor(Math.random() * securityQuestions.length)
                    ]
                  setSecurityQuestion(randomQuestion)
                  setShowPasswordModal(true)
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

      <PasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        securityQuestion={securityQuestion}
        securityAnswer={securityAnswer}
        handleSecurityAnswerChange={handleSecurityAnswerChange}
        handlePasswordChange={handlePasswordChange}
      />

      <NewPasswordModal
        show={showNewPasswordModal}
        onHide={() => setShowNewPasswordModal(false)}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        handleNewPasswordChange={handleNewPasswordChange}
      />
    </div>
  )
}

export default ProfileComponent
