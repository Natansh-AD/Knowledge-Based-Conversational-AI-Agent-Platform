import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { verifyTenant } from "../services/api"

function TenantLogin() {
  const [orgName, setOrgName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await verifyTenant(orgName)
      navigate(`${orgName}/login`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Enter Organization</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />

        <button type="submit">Continue</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

export default TenantLogin