import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./services/auth/AuthProvider"
import ProtectedRoute from "./services/routes/ProtectedRoute"

import OrgEntry from "./pages/OrgEntry"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Invite from "./pages/Invite"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<OrgEntry />} />
          <Route path="/:org/login" element={<Login />} />
          <Route path="/:org/invite/:token" element={<Invite />} />
          <Route
            path="/:org/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}