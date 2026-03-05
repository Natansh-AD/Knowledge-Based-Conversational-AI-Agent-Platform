import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import "../styles/index.css"

export default function Invite() {
  const { org, token } = useParams()
  const navigate = useNavigate()
  const { validateInvite, acceptInvite } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // -------------------------------
  // Validate token on mount
  // -------------------------------
  useEffect(() => {
    let mounted = true

    async function checkInvite() {
      try {
        const data = await validateInvite({ org, token })
        if (mounted) setEmail(data.email)
      } catch (err) {
        if (mounted) setError(err.message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkInvite()

    return () => {
      mounted = false
    }
  }, [org, token, validateInvite])

  // -------------------------------
  // Handle form submit
  // -------------------------------
  async function handleSubmit(e) {
    e.preventDefault() // prevent native browser submit
    setError("")
    setSubmitting(true)

    try {
      await acceptInvite({ org, token, username, password })
      navigate(`/${org}/dashboard`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // -------------------------------
  // Styles
  // -------------------------------
  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d4d4d4",
    fontSize: "14px",
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  }

  // -------------------------------
  // Loading or error states
  // -------------------------------
  if (loading) {
    return <div className="container">Validating invite...</div>
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2 className="page-title">Invite Error</h2>
          <p className="error">{error}</p>
        </div>
      </div>
    )
  }

  // -------------------------------
  // Main form render
  // -------------------------------
  return (
    <div className="container">
      <div className="card">
        <h2 className="page-title">Accept Invite to {org}</h2>

        <p>
          <strong>Email:</strong> {email || "Loading..."}
        </p>

        <form
          onSubmit={handleSubmit}
          style={formStyle}
        >
          <input
            type="text"
            placeholder="Choose Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Choose Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating Account..." : "Create Account"}
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}