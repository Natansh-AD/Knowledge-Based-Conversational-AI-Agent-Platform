import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/axios" // your axios instance

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Enter your organization
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>

          <div className="flex border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
            <span className="px-3 py-2 bg-gray-100 text-gray-600 select-none">
              kbc.com/
            </span>
            <input
              type="text"
              placeholder="your-org"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="flex-1 px-3 py-2 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Continue
          </button>

          {error && (
            <p className="text-red-600 text-center font-medium mt-2">
              {error}
            </p>
          )}

        </form>

      </div>

    </div>
  )
}