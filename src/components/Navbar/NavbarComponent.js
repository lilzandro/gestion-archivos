import React from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'

const NavbarComponent = ({ toggleSidebar, setActiveSection }) => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg' fixed='top'>
      <Container fluid>
        <Button
          variant='outline-light'
          onClick={toggleSidebar}
          className='me-2 d-lg-none'
        >
          ☰
        </Button>
        <Navbar.Brand
          onClick={() => setActiveSection('dashboard')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <img
            src='Logo-unellez.png'
            alt='Logo'
            style={{ width: '30px', height: '30px', marginRight: '10px' }}
          />
          Gestión de Archivos
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavbarComponent
