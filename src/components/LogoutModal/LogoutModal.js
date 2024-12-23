import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const LogoutModal = ({
  showLogoutModal,
  handleCloseLogoutModal,
  handleLogout
}) => {
  return (
    <Modal show={showLogoutModal} onHide={handleCloseLogoutModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Cierre de Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Estás seguro de que deseas cerrar sesión?</Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={handleCloseLogoutModal}>
          Cancelar
        </Button>
        <Button
          variant='danger'
          onClick={() => {
            handleLogout()
            handleCloseLogoutModal()
          }}
        >
          Cerrar Sesión
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LogoutModal
