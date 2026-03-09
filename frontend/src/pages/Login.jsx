import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import "../styles/login.css"

export default function Login() {
  const { org } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login({ username, password, org })
      navigate(`/${org}/dashboard`)
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="login-page">
      <div className="card">
        <h2 className="page-title">Login to {org}</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}