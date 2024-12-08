import React, { useState } from 'react'
import {
  Navbar,
  Container,
  Row,
  Col,
  Card,
  Button,
  Offcanvas,
  Form,
  Image
} from 'react-bootstrap'

import ProfileContent from './ProfileContent'
import { useUser } from './UserContext'
import { useNavigate } from 'react-router-dom' // Importar el hook de navegación

const Dashboard = () => {
  const { user, setUser } = useUser() // Asegúrate de incluir la función setUser del contexto
  const [showSidebar, setShowSidebar] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard') // Controla la sección activa
  const navigate = useNavigate() // Hook para navegación// Controla la sección activa

  const handleLogout = () => {
    console.log('Cerrando sesión...')
    setUser(null) // Limpia los datos del usuario en el contexto
    navigate('/login') // Redirige a la página de inicio de sesión
  }

  const toggleSidebar = () => setShowSidebar(!showSidebar)

  const userProfile = {
    name: 'Juan Pérez',
    role: 'Administrador',
    avatar: 'https://via.placeholder.com/100' // Reemplaza con la URL de la imagen real
  }

  const uploadedFiles = []

  const DocumentsContent = ({ files }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [category, setCategory] = useState('')

    const filteredFiles = files.filter(file => {
      const matchesSearch = file.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesCategory = category ? file.category === category : true
      return matchesSearch && matchesCategory
    })

    return (
      <div className='documents-content'>
        <Row className='mb-4'>
          <Col md={8}>
            <Form.Control
              type='text'
              placeholder='Buscar archivo...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className='mt-3 mt-md-0'
            >
              <option value=''>Todas las categorías</option>
              <option value='Documentos'>Documentos</option>
              <option value='Imágenes'>Imágenes</option>
              <option value='Presentaciones'>Presentaciones</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className='gy-4 gx-4'>
          {filteredFiles.length > 0 ? (
            filteredFiles.map(file => (
              <Col md={4} key={file.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{file.name}</Card.Title>
                    <Card.Text>
                      Tamaño: {file.size}
                      <br />
                      Fecha: {file.date}
                    </Card.Text>
                    <Button variant='danger' size='sm'>
                      Eliminar
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className='text-muted text-center'>
              No se encontraron archivos.
            </p>
          )}
        </Row>
      </div>
    )
  }
  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg' fixed='top'>
        <Container fluid>
          <Button
            variant='outline-light'
            onClick={toggleSidebar}
            className='me-2 d-lg-none'
          >
            ☰
          </Button>
          <Navbar.Brand href='#home'>Gestión de Archivos</Navbar.Brand>
        </Container>
      </Navbar>

      <div className='sidebar d-none d-lg-block'>
        <div className='text-center p-3'>
          <Image
            src={userProfile.avatar}
            roundedCircle
            width={100}
            height={100}
            alt='Foto de perfil'
          />
          <h5 className='mt-2'>{user?.nombre + ' ' + user?.apellido}</h5>
          <p className='text-muted'>{userProfile.role}</p>
          <hr />
        </div>
        <nav className='p-3'>
          <Button
            variant='primary'
            className='w-100 text-start mb-3'
            onClick={() => setActiveSection('dashboard')}
          >
            Inicio
          </Button>
          <Button
            variant='primary'
            className='w-100 text-start mb-3'
            onClick={() => setActiveSection('documents')}
          >
            Documentos
          </Button>
          <Button
            variant='primary'
            className='w-100 text-start mb-3'
            onClick={() => setActiveSection('profile')}
          >
            Perfil
          </Button>
          <Button
            variant='danger'
            className='w-100 text-start'
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </nav>
      </div>

      <Offcanvas
        show={showSidebar}
        onHide={toggleSidebar}
        className='d-lg-none'
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='text-center'>
            <Image
              src={userProfile.avatar}
              roundedCircle
              width={100}
              height={100}
              alt='Foto de perfil'
            />
            <h5 className='mt-2'>{user?.nombre + ' ' + user?.apellido}</h5>
            <p className='text-muted'>{userProfile.role}</p>
            <hr />
          </div>
          <nav>
            <Button
              variant='primary'
              className='w-100 text-start mb-3'
              onClick={() => {
                setActiveSection('dashboard')
                toggleSidebar()
              }}
            >
              Inicio
            </Button>
            <Button
              variant='primary'
              className='w-100 text-start mb-3'
              onClick={() => {
                setActiveSection('documents')
                toggleSidebar()
              }}
            >
              Documentos
            </Button>
            <Button
              variant='primary'
              className='w-100 text-start mb-3'
              onClick={() => {
                setActiveSection('profile')
                toggleSidebar()
              }}
            >
              Perfil
            </Button>
            <Button
              variant='danger'
              className='w-100 text-start'
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Container className='dashboard-content mt-9'>
        {activeSection === 'dashboard' && (
          <div>
            <Row className='mb-4'>
              <Col>
                <Button variant='primary' className='w-100'>
                  Subir Archivo
                </Button>
              </Col>
              <Col>
                <Button variant='secondary' className='w-100'>
                  Crear Categoría
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
                              <Card.Title>{file.name}</Card.Title>
                              <Card.Text>
                                Tamaño: {file.size}
                                <br />
                                Fecha: {file.date}
                              </Card.Text>
                              <Button variant='danger' size='sm'>
                                Eliminar
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
          <ProfileContent
            userProfile={userProfile}
            onDeleteAccount={() => {
              console.log('Cuenta eliminada')
              // Lógica adicional para manejar la eliminación de la cuenta
            }}
          />
        )}
      </Container>
    </>
  )
}

export default Dashboard
