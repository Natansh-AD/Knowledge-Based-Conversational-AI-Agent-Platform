import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function Home() {
  const { tenant } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTenantData = async () => {
        try {
        const token = localStorage.getItem("access_token")

        const response = await fetch(
            `http://localhost:8000/${tenant}/api/`,
            {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            }
        )

        if (!response.ok) {
            throw new Error("Unauthorized or failed request")
        }

        const result = await response.json()
        setData(result)

        } catch (err) {
        setError(err.message)
        } finally {
        setLoading(false)
        }
    }

    if (tenant) {
        fetchTenantData()
    }
    }, [tenant])

  return (
    <div>
      <h1>Welcome to the Knowledge-Based Conversational AI Agent Platform</h1>
      <p>Tenant: {tenant}</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div>
          <h3>Tenant API Response:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default Home