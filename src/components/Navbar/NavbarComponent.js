import React from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'

const NavbarComponent = ({ toggleSidebar, userProfile }) => {
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
        <Navbar.Brand href='#home'>Gestión de Archivos</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavbarComponent
