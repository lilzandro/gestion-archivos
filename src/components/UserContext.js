import React, { createContext, useState, useContext } from 'react'

// Crear el contexto de usuario
const UserContext = createContext()

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

// Hook para acceder al contexto
export const useUser = () => useContext(UserContext)
