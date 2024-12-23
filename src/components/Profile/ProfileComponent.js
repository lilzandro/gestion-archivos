import React from 'react'
import { Card, Button, Image, Row, Col } from 'react-bootstrap'

const ProfileComponent = ({ userProfile, onDeleteAccount }) => {
  return (
    <div className='profile-content'>
      <Row className='mb-4'>
        <Col>
          <Card>
            <Card.Body className='text-center'>
              <Image
                src={userProfile.avatar}
                roundedCircle
                width={150}
                height={150}
                alt='Foto de perfil'
              />
              <h5 className='mt-3'>{userProfile.name}</h5>
              <p className='text-muted'>{userProfile.role}</p>
              <Button variant='danger' onClick={onDeleteAccount}>
                Eliminar Cuenta
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ProfileComponent
