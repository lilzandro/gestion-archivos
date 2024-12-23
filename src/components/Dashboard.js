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
import ProfileComponent from './Profile/ProfileComponent'
import NavbarComponent from './Navbar/NavbarComponent'
import SidebarComponent from './Sidebar/SidebarComponent'
import DocumentsContent from './DocumentsContent/DocumentsContent'
import FileUploadModalComponent from './FileUploadModal/FileUploadModalComponent'

const Dashboard = () => {
  const { setUser } = useUser()
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = JSON.parse(atob(token.split('.')[1])).id // Extrae el ID del token

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login') // Redirigir al login si no hay token
      return
    }

    // Verificar si el token es válido
    axios
      .get('http://localhost:5000/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        console.log('Token válido:', response.data)
      })
      .catch(error => {
        console.error('Token inválido o expirado:', error)
        localStorage.removeItem('token') // Eliminar token
        navigate('/login') // Redirigir al login
      })
  }, [navigate])

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/files/${userId}`
        )
        setUploadedFiles(response.data)
      } catch (error) {}
    }

    fetchFiles()
  }, [userId])

  const handleLogout = () => {
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

  // useEffect para obtener los archivos cuando el componente se monte
  // Se ejecuta solo una vez cuando el componente se monta

  return (
    <>
      <NavbarComponent
        toggleSidebar={toggleSidebar}
        userProfile={userProfile}
      />
      <SidebarComponent
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
                      {uploadedFiles.map(file => (
                        <Col md={4} key={file.id}>
                          <Card>
                            <Card.Body>
                              <Card.Title>{file.file_name}</Card.Title>
                              <Card.Text>
                                Categoría: {file.category || 'Sin categoría'}
                                <br />
                                Descripción:{' '}
                                {file.description || 'Sin descripción'}
                                <br />
                                Subido el:{' '}
                                {new Date(file.created_at).toLocaleDateString()}
                              </Card.Text>
                              <Button
                                variant='primary'
                                size='sm'
                                href={`http://localhost:5000/${file.file_path}`}
                                target='_blank'
                              >
                                Ver Archivo
                              </Button>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
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
          <DocumentsContent files={uploadedFiles} />
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
      <FileUploadModalComponent
        showUploadModal={showUploadModal}
        setShowUploadModal={setShowUploadModal}
        setUploadedFiles={setUploadedFiles}
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
    </>
  )
}

export default Dashboard
