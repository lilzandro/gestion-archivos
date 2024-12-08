import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos registrados:', formData);
    setSuccess(true);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%',maxWidth: '700px', // Ajusta el ancho máximo
          minWidth: '350px', padding: '20px' }}>
        <h3 className="text-center">Registro de Usuario</h3>
        {success && <Alert variant="success" className="mt-3">¡Registro exitoso!</Alert>}
        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Crea una contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100">Registrarse</Button>
        </Form>
        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;
