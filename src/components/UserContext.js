import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const useUser = () => {
  return useContext(UserContext)
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null) // Estado del usuario
  const [loading, setLoading] = useState(true) // Para evitar renderizado hasta que se valide el token

  // Recuperar y validar el token al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios
        .get('http://localhost:5000/validate-token', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          setUser(response.data.user) // Configura el usuario en caso de éxito
        })
        .catch(() => {
          localStorage.removeItem('token') // Elimina un token inválido
          localStorage.removeItem('user') // Limpia el almacenamiento local
        })
        .finally(() => {
          setLoading(false) // Termina la validación
        })
    } else {
      setLoading(false) // Si no hay token, termina inmediatamente
    }
  }, [])

  const value = {
    user,
    setUser,
    loading
  }

  return (
    <UserContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </UserContext.Provider>
  )
}
