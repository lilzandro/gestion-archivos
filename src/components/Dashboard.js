import React, { useState, useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Image,
  Modal
} from 'react-bootstrap'
import axios from 'axios'
import { useUser } from './UserContext'
import { useNavigate } from 'react-router-dom'
import ProfileComponent from './BarraLateral/Profile/ProfileComponent'
import NavbarComponent from './Navbar/NavbarComponent'
import BarraLateral from './BarraLateral/BarraLateral'
import ContenidoArchivo from './BarraLateral/ContenidoArchivo/ContenidoDelArchivo'
import ModalCargaArchivos from './ModalArchivo/ModalCargaArchivo'
import PDFViewer from './PDFViewer'

const Dashboard = () => {
  const { setUser } = useUser()
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null // Extrae el ID del token
  const [loading, setLoading] = useState(true)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [selectedFileUrl, setSelectedFileUrl] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      setLoading(false) // Redirigir al login si no hay token
      return
    }

    // Verificar si el token es válido
    axios
      .get('http://localhost:5000/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log('Token válido:', response.data)
        const user = JSON.parse(localStorage.getItem('user'))
        if (user) {
          setUser(user) // Guardar el usuario en el contexto
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Token inválido o expirado:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user') // Eliminar token
        navigate('/login')
        setLoading(false) // Redirigir al login
      })
  }, [navigate, setUser])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/files/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setUploadedFiles(response.data)
      } catch (error) {
        console.error('Error al obtener archivos:', error)
      }
    }

    if (userId) {
      fetchFiles()
    }
  }, [token, userId])

  if (loading) {
    return <div>Cargando...</div> // Puedes mostrar un spinner o mensaje mientras se valida el token
  }

  const handleViewFile = fileUrl => {
    setSelectedFileUrl(fileUrl)
    setShowPDFViewer(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const handleShowLogoutModal = () => setShowLogoutModal(true)
  const handleCloseLogoutModal = () => setShowLogoutModal(false)

  const toggleSidebar = () => setShowSidebar(!showSidebar)

  const userProfile = {
    name: 'Juan Pérez',
    role: 'Administrador',
    avatar: 'https://via.placeholder.com/100'
  }

  return (
    <>
      <NavbarComponent
        toggleSidebar={toggleSidebar}
        userProfile={userProfile}
      />
      <BarraLateral
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        userProfile={userProfile}
        setActiveSection={setActiveSection}
        handleShowLogoutModal={handleShowLogoutModal}
      />
      <Container className='dashboard-content mt-9'>
        {activeSection === 'dashboard' && (
          <div>
            <Row className='mb-4'>
              <Col>
                <Button
                  variant='primary'
                  className='w-100'
                  onClick={() => setShowUploadModal(true)}
                >
                  Subir Archivo
                </Button>
              </Col>
            </Row>
            <Row className='gy-4'>
              <Col>
                <h4>Archivos Subidos Recientemente</h4>
                <div className='uploaded-files p-3 border rounded bg-light'>
                  {uploadedFiles.length > 0 ? (
                    <Row className='gy-4 gx-4'>
                      {uploadedFiles.slice(0, 9).map(file =>
                        file && file.file_name ? (
                          <Col xs={12} md={4} key={file.id}>
                            <Card
                              className='shadow-sm h-100'
                              style={{
                                maxWidth: '300px',
                                minHeight: '200px',
                                maxHeight: '250px'
                              }}
                            >
                              <Card.Body className='d-flex align-items-center'>
                                {/* Ícono del archivo */}
                                <span className='fs-1 me-3'>
                                  {file.file_name.endsWith('.pdf')
                                    ? '📄'
                                    : '🖼️'}
                                </span>
                                {/* Información del archivo */}
                                <div
                                  className='text-truncate'
                                  style={{ overflow: 'hidden' }}
                                >
                                  <Card.Title className='fw-bold text-truncate'>
                                    {file.file_name}
                                  </Card.Title>
                                  <Card.Text>
                                    <span className='fw-semibold text-primary'>
                                      Categoría:
                                    </span>{' '}
                                    {file.category || (
                                      <span className='text-muted'>
                                        Sin categoría
                                      </span>
                                    )}
                                    <br />
                                    <span className='fw-semibold text-primary'>
                                      Descripción:
                                    </span>{' '}
                                    {file.description || (
                                      <span className='text-muted'>
                                        Sin descripción
                                      </span>
                                    )}
                                    <br />
                                    <span className='fw-semibold text-primary'>
                                      Subido el:
                                    </span>{' '}
                                    {file.created_at
                                      ? new Date(
                                          file.created_at
                                        ).toLocaleDateString()
                                      : 'Fecha no disponible'}
                                  </Card.Text>
                                  <Button
                                    variant='outline-primary'
                                    size='sm'
                                    onClick={() =>
                                      handleViewFile(
                                        `http://localhost:5000/${file.file_path}`,
                                        file.file_name // Aquí pasas el nombre del archivo
                                      )
                                    }
                                  >
                                    Ver Archivo
                                  </Button>
                                </div>
                              </Card.Body>
                            </Card>
                          </Col>
                        ) : null
                      )}
                    </Row>
                  ) : (
                    <div className='text-center'>
                      <p className='text-muted'>No hay archivos subidos aún.</p>
                      <Image
                        src='https://via.placeholder.com/200x150'
                        alt='No archivos'
                        className='my-3'
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        )}
        {activeSection === 'documents' && (
          <ContenidoArchivo files={uploadedFiles} />
        )}
        {activeSection === 'profile' && (
          <ProfileComponent
            userProfile={userProfile}
            onDeleteAccount={() => {
              console.log('Cuenta eliminada')
            }}
          />
        )}
      </Container>

      {/* Modal de Subir Archivo */}
      <ModalCargaArchivos
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        setUploadedFiles={setUploadedFiles} // Pasamos la función de actualizar archivos
      />

      {/* Modal de Confirmación para Cerrar Sesión */}
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
      <PDFViewer
        show={showPDFViewer}
        onHide={() => setShowPDFViewer(false)}
        fileUrl={selectedFileUrl}
      />
    </>
  )
}

export default Dashboard
