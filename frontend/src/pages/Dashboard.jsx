import { useParams } from "react-router-dom"
import { useAuth } from "../services/auth/useAuth"
import "../index.css"

const roleChoices = {
  "1": "Admin",
  "2": "User",
}

export default function Dashboard() {
  const { org } = useParams()
  const { user, logout } = useAuth()

  return (
    <div className="container">
      <div className="card">
        <h2>{org} Dashboard</h2>
        <p>Welcome <strong>{user?.username}</strong></p>
        
        {/* Display user profile information */}
        <div className="profile-info">
          <div className="profile-item">
            <strong>Email:</strong> {user?.email || "Not provided"}
          </div>
          <div className="profile-item">
            <strong>Phone Number:</strong> {user?.phone_number || "Not provided"}
          </div>
          <div className="profile-item">
            <strong>Role:</strong> {roleChoices[user?.role] || "Not specified"}
          </div>
          <div className="profile-item">
            <strong>First Name:</strong> {user?.first_name || "Not provided"}
          </div>
          <div className="profile-item">
            <strong>Last Name:</strong> {user?.last_name || "Not provided"}
          </div>
          <div className="profile-item">
            <strong>Date Joined:</strong> {new Date(user?.date_joined).toLocaleDateString()}
          </div>
          <div className="profile-item">
            <strong>Last Login:</strong> {user?.last_login ? new Date(user?.last_login).toLocaleDateString() : "Never logged in"}
          </div>
        </div>

        {/* Logout button */}
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}