import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Dummy users for frontend-first development (Day 1-5).
// Replace with real JWT + Spring Boot API calls once the backend is ready.
const DUMMY_USERS = {
  'admin@skilltrack.dev': { password: 'admin123', role: 'ADMIN', name: 'Priya Sharma' },
  'trainer@skilltrack.dev': { password: 'trainer123', role: 'TRAINER', name: 'Rohit Kulkarni' },
  'student@skilltrack.dev': { password: 'student123', role: 'STUDENT', name: 'Aditi Deshmukh' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('st_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, password) => {
    const record = DUMMY_USERS[email]
    if (!record || record.password !== password) {
      return { success: false, message: 'Invalid email or password.' }
    }
    const sessionUser = { email, role: record.role, name: record.name }
    setUser(sessionUser)
    sessionStorage.setItem('st_user', JSON.stringify(sessionUser))
    return { success: true, user: sessionUser }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('st_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
