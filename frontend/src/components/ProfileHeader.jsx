import { useState } from "react"
import EditProfileModal from "./EditProfileModal"
import InviteModal from "./InviteModal"

export default function ProfileHeader({ user }) {

  const [showEdit, setShowEdit] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  const userRole = {
    "1" : "Admin",
    "2" : "Member"
  }

  

  return (
    <>
      <div className="profile-header">

        <div className="profile-left">

          <div className="avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
            <span className="role">{userRole[user?.role] || user?.role}</span>
          </div>

        </div>

        <div>

          <button onClick={() => setShowEdit(true)}>
            Edit Profile
          </button>

          { user?.role === 1 &&
            <button onClick={() => setShowInvite(true)}>
            Invite User
          </button>
      }
        </div>

      </div>

      {showEdit && (
        <EditProfileModal
          user={user}
          close={() => setShowEdit(false)}
        />
      )}

      {showInvite && (
        <InviteModal
          close={() => setShowInvite(false)}
        />
      )}

    </>
  )
}