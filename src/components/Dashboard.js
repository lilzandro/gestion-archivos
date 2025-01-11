import React, { useState, useEffect, createContext } from 'react'
import { Container, Row, Col, Button, Image, Modal } from 'react-bootstrap'
import axios from 'axios'
import { useUser } from './UserContext'
import { useNavigate } from 'react-router-dom'
import ProfileComponent from './BarraLateral/Profile/ProfileComponent'
import NavbarComponent from './Navbar/NavbarComponent'
import BarraLateral from './BarraLateral/BarraLateral'
import ContenidoArchivo from './BarraLateral/BuscarArchivo/BuscarArchivo'
import ModalCargaArchivos from './ModalArchivo/ModalCargaArchivo'
import PDFViewer from './PDFViewer'
import ArchivoCard from './ArchivoCard'
import { Toaster, toast } from 'react-hot-toast'

const FileContext = createContext()

const Dashboard = () => {
  const { user, setUser } = useUser()
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [fileToDelete, setFileToDelete] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null // Extrae el ID del token
  const [loading, setLoading] = useState(true)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [selectedFileUrl, setSelectedFileUrl] = useState(null)
  const [selectedFileName, setSelectedFileName] = useState(null)

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
        const response = await axios.get(`http://localhost:5000/files/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
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

  const handleViewFile = (fileUrl, fileName) => {
    setSelectedFileUrl(fileUrl)
    setSelectedFileName(fileName) // Guarda el nombre del archivo
    setShowPDFViewer(true)
  }

  const handleDeleteFile = async () => {
    try {
      await axios.delete(`http://localhost:5000/files/${fileToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUploadedFiles(uploadedFiles.filter(file => file.id !== fileToDelete))
      setShowDeleteModal(false)

      // Mostrar notificación de éxito
      toast.success('Archivo eliminado con éxito!')
    } catch (error) {
      console.error('Error al eliminar archivo:', error)

      // Mostrar notificación de error
      toast.error('Hubo un problema al eliminar el archivo.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
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
    <FileContext.Provider value={{ uploadedFiles, setUploadedFiles }}>
      <Toaster position='top-center' reverseOrder={false} />
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
                {user && user.role === 'admin' && (
                  <Button
                    variant='primary'
                    className='w-100'
                    onClick={() => setShowUploadModal(true)}
                  >
                    Subir Archivo
                  </Button>
                )}
              </Col>
            </Row>
            <Row className='gy-4'>
              <Col>
                <h4>Archivos Subidos Recientemente</h4>
                <div className='uploaded-files p-3 border rounded bg-light'>
                  {uploadedFiles.length > 0 ? (
                    <Row className='gy-4 gx-4 '>
                      {uploadedFiles.slice(0, 9).map(file =>
                        file && file.file_name ? (
                          <ArchivoCard
                            key={file.id}
                            file={file}
                            handleViewFile={handleViewFile}
                            handleDeleteFile={() => {
                              setFileToDelete(file.id)
                              setShowDeleteModal(true)
                            }}
                            isAdmin={user && user.role === 'admin'}
                          />
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
          <ContenidoArchivo
            files={uploadedFiles}
            handleViewFile={handleViewFile}
            handleDeleteFile={file => {
              setFileToDelete(file.id)
              setShowDeleteModal(true)
            }}
            isAdmin={user && user.role === 'admin'}
          />
        )}
        {activeSection === 'profile' && (
          <ProfileComponent
            userId={userId}
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

      {/* Modal de Confirmación para Eliminar Archivo */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación de Archivo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este archivo?
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant='danger' onClick={handleDeleteFile}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <PDFViewer
        show={showPDFViewer}
        onHide={() => setShowPDFViewer(false)}
        fileUrl={selectedFileUrl}
        fileName={selectedFileName} // Pasamos el nombre del archivo
      />
    </FileContext.Provider>
  )
}

export default Dashboard
export { FileContext }
