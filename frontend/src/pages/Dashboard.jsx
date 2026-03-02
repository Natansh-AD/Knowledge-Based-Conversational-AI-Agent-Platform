import { useParams } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import "../index.css"

export default function Dashboard() {
  const { org } = useParams()
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>{org} Dashboard</h1>
      <p>Welcome {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}