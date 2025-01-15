import React, { useState, useRef } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const PasswordModal = ({
  show,
  onHide,
  newPassword,
  confirmPassword,
  handleNewPasswordChange,
  handleConfirmPasswordChange,
  handleChangePassword
}) => {
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordRef = useRef(null)
  const confirmPasswordRef = useRef(null)
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*.,]).{8,20}$/

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handlePasswordChange = () => {
    if (newPassword.length < 8 || newPassword.length > 20) {
      setPasswordError('La contraseña debe tener entre 8 y 20 caracteres.')
      passwordRef.current.focus()
      return false
    } else if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        'La contraseña debe tener al menos un número y un carácter especial (signos de puntuacion y numeros).'
      )
      passwordRef.current.focus()
      return false
    } else {
      setPasswordError('')
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Las contraseñas no coinciden.')
      confirmPasswordRef.current.focus()
      return false
    } else {
      setConfirmPasswordError('')
    }

    handleChangePassword()
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cambiar Contraseña</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className='mb-3'>
            <Form.Label>Nueva Contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={handleNewPasswordChange}
                ref={passwordRef}
                isInvalid={!!passwordError}
              />
              <Button
                variant='outline-secondary'
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </Button>
              <Form.Control.Feedback type='invalid'>
                {passwordError}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Confirmar Nueva Contraseña</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                ref={confirmPasswordRef}
                isInvalid={!!confirmPasswordError}
              />
              <Button
                variant='outline-secondary'
                onClick={toggleConfirmPasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showConfirmPassword ? faEyeSlash : faEye}
                />
              </Button>
              <Form.Control.Feedback type='invalid'>
                {confirmPasswordError}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cancelar
        </Button>
        <Button variant='primary' onClick={handlePasswordChange}>
          Cambiar Contraseña
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PasswordModal
