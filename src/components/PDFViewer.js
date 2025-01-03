import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

const PDFViewer = ({ show, onHide, fileUrl }) => {
  const isPDF = fileUrl && fileUrl.endsWith('.pdf')

  return (
    <Modal show={show} onHide={onHide} size='xl' centered>
      <Modal.Header closeButton>
        <Modal.Title>Visor de Archivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fileUrl ? (
          isPDF ? (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}
            >
              <div style={{ height: '80vh' }}>
                <Viewer fileUrl={fileUrl} />
              </div>
            </Worker>
          ) : (
            <img
              src={fileUrl}
              alt='Visualización de imagen'
              width='100%'
              height='600px'
              style={{ objectFit: 'contain' }}
            />
          )
        ) : (
          <p>No se ha proporcionado ningún archivo.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PDFViewer
