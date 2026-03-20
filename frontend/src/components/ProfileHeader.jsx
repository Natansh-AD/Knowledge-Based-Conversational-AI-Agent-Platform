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
      <div className="flex justify-between items-center bg-white p-8 rounded-lg mb-8 w-full">

        <div className="flex items-center gap-5">

          <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center text-2xl">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-lg font-semibold">{user?.username}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="text-xs bg-gray-200 px-3 py-1 rounded-full mt-2 inline-block">
              {userRole[user?.role] || user?.role}
            </span>
          </div>

        </div>

        <div className="flex gap-2">

          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setShowEdit(true)}
          >
            Edit Profile
          </button>

          {user?.role === 1 && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
              onClick={() => setShowInvite(true)}
            >
              Invite User
            </button>
          )}

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