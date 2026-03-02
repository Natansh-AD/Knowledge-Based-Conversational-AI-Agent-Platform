import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios" // your axios instance

export default function OrgEntry() {
  const [org, setOrg] = useState("")
  const [error, setError] = useState("") // Add error state
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!org) return

    try {
      const res = await api.get(`/${org}/`) // Your tenant validation endpoint

      if (res.status === 200) {
        navigate(`/${org}/login`) // Navigate to the login page if tenant is valid
      } else {
        setError("Tenant not found") // Set error state
      }
    } catch (err) {
      setError("Tenant does not exist") // Set error state on failure
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2 >Enter your organization</h2>

        <form onSubmit={handleSubmit}>
          <div className="url-input">
            <div className="url-prefix">kbc.com/</div>
            <input
              type="text"
              placeholder="your-org"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />
          </div>

          <button type="submit">Continue</button>
        </form>

        {error && <p className="error">{error}</p>} {/* Display error if any */}
      </div>
    </div>
  )
}