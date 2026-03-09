import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import "../styles/invite.css" // import scoped CSS

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
    return () => { mounted = false }
  }, [org, token, validateInvite])

  // -------------------------------
  // Handle form submit
  // -------------------------------
  async function handleSubmit(e) {
    e.preventDefault()
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
  // Loading state
  // -------------------------------
  if (loading) {
    return (
      <div className="invite-page">
        <div className="card">Validating invite...</div>
      </div>
    )
  }

  // -------------------------------
  // Error state
  // -------------------------------
  if (error) {
    return (
      <div className="invite-page">
        <div className="card">
          <h2 className="page-title">Invite Error</h2>
          <p className="error">{error}</p>
        </div>
      </div>
    )
  }

  // -------------------------------
  // Main form
  // -------------------------------
  return (
    <div className="invite-page">
      <div className="card">
        <h2 className="page-title">Accept Invite to {org}</h2>

        <p><strong>Email:</strong> {email || "Loading..."}</p>

        <form className="invite-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Choose Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Choose Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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