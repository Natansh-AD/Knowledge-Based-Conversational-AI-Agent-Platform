import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios" // your axios instance
import "../styles/orgEntry.css"

export default function OrgEntry() {
  const [org, setOrg] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!org) return

    try {
      const res = await api.get(`/${org}/`)
      if (res.status === 200) navigate(`/${org}/login`)
      else setError("Tenant not found")
    } catch {
      setError("Tenant does not exist")
    }
  }

  return (
    <div className="org-entry-page"> {/* unique wrapper */}
      <div className="container">
        <div className="card">
          <h2>Enter your organization</h2>
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
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    </div>
  )
}