import React from 'react'
import { Button, Image, Offcanvas } from 'react-bootstrap'
import { useUser } from '../UserContext' // Importa el contexto de usuario

const BarraLateral = ({
  showSidebar,
  toggleSidebar,
  setActiveSection,
  handleShowLogoutModal
}) => {
  const { user } = useUser() // Obtén la información del usuario desde el contexto

  return (
    <>
      {/* Barra lateral en escritorio */}
      <div className='sidebar d-none d-lg-block'>
        <div className='text-center p-3'>
          <Image
            src='user.png'
            roundedCircle
            width={100}
            height={100}
            alt='Foto de perfil'
          />
          <h5 className='mt-2'>
            {user?.nombre} {user?.apellido}
          </h5>
          <p className='text-muted'>{user?.role}</p>
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
            onClick={handleShowLogoutModal}
          >
            Cerrar Sesión
          </Button>
        </nav>
      </div>

      {/* Barra lateral en móvil */}
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
              src='user.png'
              roundedCircle
              width={100}
              height={100}
              alt='Foto de perfil'
            />
            <h5 className='mt-2'>
              {user?.nombre} {user?.apellido}
            </h5>
            <p className='text-muted'>Rol:{user?.role}</p>
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
              onClick={handleShowLogoutModal}
            >
              Cerrar Sesión
            </Button>
          </nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default BarraLateral
