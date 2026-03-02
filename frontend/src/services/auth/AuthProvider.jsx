import { createContext, useEffect, useState } from "react"
import { api } from "../../api/axios"
import { getOrgFromPath } from "../../helpers/getTenant"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const tenant = getOrgFromPath() // e.g., "acme"
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false) // to prevent concurrent refreshes

  // -------------------------------
  // Initialize session on mount
  // -------------------------------
  useEffect(() => {
    const init = async () => {
      await checkSession()
    }
    init()
  }, [tenant])

  // -------------------------------
  // Check current session
  // -------------------------------
  async function checkSession() {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/${tenant}/api/me/`)
      setUser(res.data)
    } catch (err) {
      setUser(null)
      if (err.response && err.response.status !== 401) {
        setError("Failed to load session")
      }
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------
  // Login function
  // -------------------------------
  async function login(data) {
    setError(null)
    try {
      await api.post(`/${tenant}/api/token/`, data)
      await checkSession()
    } catch (err) {
      setUser(null)
      setError("Invalid credentials")
      throw err // so the form can handle it too
    }
  }

  // -------------------------------
  // Logout function
  // -------------------------------
  async function logout() {
    try {
      await api.post(`/${tenant}/api/logout/`)
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
    }
  }

  // -------------------------------
  // Refresh token function
  // -------------------------------
  async function refresh() {
    if (refreshing) return // prevent multiple calls
    setRefreshing(true)
    try {
      await api.post(`/${tenant}/api/token/refresh/`)
      await checkSession()
    } catch (err) {
      console.error("Refresh failed:", err)
      setUser(null)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}