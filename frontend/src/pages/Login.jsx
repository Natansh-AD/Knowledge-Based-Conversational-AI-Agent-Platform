import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import "../styles/index.css"

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

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d4d4d4",
    fontSize: "14px",
  }

  const formStyle = { display: "flex", flexDirection: "column", gap: "14px" }
  

  return (
    <div className="container">
      <div className="card">
        <h2 className="page-title">Login to {org}</h2>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button type="submit">Login</button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}