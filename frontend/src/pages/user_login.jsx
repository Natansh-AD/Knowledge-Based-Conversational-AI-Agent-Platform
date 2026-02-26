import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Get tenant from URL or local state if you want
  const tenant = window.location.pathname.split("/")[1] || "" // optional
//   console.log("Tenant:", tenant)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch(
        `http://localhost:8000/${tenant}/api/token/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password: password }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || "Login failed")
      }

      const data = await response.json()

      // Save JWT in localStorage (or sessionStorage)
      localStorage.setItem("access_token", data.access)
      localStorage.setItem("refresh_token", data.refresh)

      // Redirect to dashboard
      navigate(`/${tenant}/home`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default Login