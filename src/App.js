import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Login from './components/InicioDeSecion/Login'
import RecoverPasswordForm from './components/InicioDeSecion/RecoverPasswordForm' // Importar el nuevo componente
import { UserProvider, useUser } from './components/UserContext' // Importar UserProvider y hook de contexto
import axios from 'axios'

const AppContent = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { user, setUser } = useUser() // Usar el contexto para manejar el estado de usuario

  useEffect(() => {
    // Verificar si hay un token válido al cargar la app
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await axios.get(
            'http://localhost:5000/validate-token',
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          )
          setUser(response.data.user) // Establecer el usuario en el contexto
        } catch (error) {
          console.error('Token inválido o expirado:', error)
          localStorage.removeItem('token') // Eliminar token inválido
        }
      }
      setIsCheckingAuth(false) // Finalizar la verificación
    }
    checkAuth()
  }, [setUser])

  if (isCheckingAuth) {
    return <div>Cargando...</div> // Mostrar un indicador mientras se verifica el estado de autenticación
  }

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={user ? <Navigate to='/dashboard' /> : <Login />}
        />
        <Route
          path='/dashboard'
          element={user ? <Dashboard /> : <Navigate to='/login' />}
        />
        <Route path='/recover-password' element={<RecoverPasswordForm />} />{' '}
        <Route path='/' element={<Navigate to='/login' />} />
      </Routes>
    </Router>
  )
}

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  )
}

export default App
