import { useAuth } from "../services/auth/useAuth"
import ProfileHeader from "../components/ProfileHeader"
import AccountDetails from "../components/AccountDetails"
import UsersTable from "../components/UsersTable"
import FutureSection from "../components/FutureSection"
import LoadingButton from "../components/LoadingButton"

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* White card container */}
      <div className="dashboard-page flex-1 bg-white p-10 rounded-lg mx-auto max-w-7xl w-full flex flex-col">
        <ProfileHeader user={user} />
        <AccountDetails user={user} />
        {user?.role === 1 && <UsersTable />}
        <FutureSection />
      </div>

      {/* Logout button footer */}
      <div className="w-full bg-gray-50 flex justify-end p-6">
        <LoadingButton
          text="Logout"
          loadingText="Logging out..."
          onClick={logout}
        />
      </div>

    </div>
  )
}