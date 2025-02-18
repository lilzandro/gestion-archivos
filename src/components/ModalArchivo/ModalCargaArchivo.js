import React from 'react'
import { Modal } from 'react-bootstrap'
import SubirArchivo from './SubirArchivo' // Asegúrate de que SubirArchivo esté bien importado

const ModalCargaArchivos = ({
  showUploadModal,
  setShowUploadModal,
  setUploadedFiles
}) => {
  return (
    <Modal
      show={showUploadModal}
      onHide={() => setShowUploadModal(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Subir Archivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SubirArchivo setUploadedFiles={setUploadedFiles} />
      </Modal.Body>
    </Modal>
  )
}

export default ModalCargaArchivos
