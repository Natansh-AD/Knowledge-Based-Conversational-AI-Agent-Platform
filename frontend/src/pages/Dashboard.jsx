import { useAuth } from "../services/auth/useAuth"
import ProfileHeader from "../components/ProfileHeader"
import AccountDetails from "../components/AccountDetails"
import UsersTable from "../components/UsersTable"
import FutureSection from "../components/FutureSection"
import LoadingButton from "../components/LoadingButton"

import "../styles/dashboard.css"



export default function Dashboard() {

  const { user, logout } = useAuth()

  return (
    <div className="dashboard-page">

      <ProfileHeader user={user} />

      <AccountDetails user={user} />

      {user?.role === 1 && <UsersTable />}
      

      <FutureSection />

      <LoadingButton text="Logout" onClick={logout} loadingText="Logging out..." />

    </div>
  )
}