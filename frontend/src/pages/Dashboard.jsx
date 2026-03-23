import { useEffect } from "react";
import { useAuth } from "../services/auth/useAuth";
import ProfileHeader from "../components/ProfileHeader";
import AccountDetails from "../components/AccountDetails";
import UsersTable from "../components/UsersTable";
import FutureSection from "../components/FutureSection";
import { useTitle } from "../components/layout/TitleContext";
import usePageTitle from "../components/layout/usePageTitle";

export default function Dashboard() {
  const { user } = useAuth();
  usePageTitle("Dashboard")
  
  return (
    <div className="dashboard-page flex-1 bg-white p-10 rounded-lg mx-auto max-w-7xl w-full flex flex-col">
      <ProfileHeader user={user} />
      <AccountDetails user={user} />
      {user?.role === 1 && <UsersTable />}
      <FutureSection />
    </div>
  );
}