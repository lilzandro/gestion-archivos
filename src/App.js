import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Upload from './components/Upload'
import Login from './components/Login'
import { UserProvider } from './components/UserContext' // Importar UserProvider

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Simulación de sesión

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<Login onLogin={handleLogin} />} />
          <Route path='/register' element={<Login onLogin={handleLogin} />} />
          <Route
            path='/dashboard'
            element={
              isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
              ) : (
                <Navigate to='/login' />
              )
            }
          />
          <Route
            path='/upload'
            element={isLoggedIn ? <Upload /> : <Navigate to='/login' />}
          />
          <Route path='/' element={<Navigate to='/login' />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
