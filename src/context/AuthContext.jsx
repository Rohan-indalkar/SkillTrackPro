import React, { createContext, useContext, useState } from 'react'
import { api } from '../services/mockApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('st_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = async (email, password) => {
    const result = await api.auth.login(email, password)
    if (!result.success) return result
    setUser(result.user)
    sessionStorage.setItem('st_user', JSON.stringify(result.user))
    return result
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('st_user')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
