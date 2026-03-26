import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import { toast } from "react-hot-toast"

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
      toast.success("Login Successful !!")
      navigate(`/${org}/dashboard`)
    } catch {
      setError("Invalid credentials")
      toast.error("Login Failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          User Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Sign in for the Organization: <span className="font-medium text-gray-800">{org}</span>
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Login
          </button>

          {/* Forgot Password Link */}
          <p className="text-center mt-2">
            <button
              type="button"
              onClick={() => navigate(`/${org}/forgot-password`)}
              className="text-indigo-600 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </p>

          {error && (
            <p className="text-red-600 text-center font-medium mt-3">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}