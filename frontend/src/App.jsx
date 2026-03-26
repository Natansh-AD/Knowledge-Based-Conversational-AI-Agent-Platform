import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./services/auth/AuthProvider"
import ProtectedRoute from "./services/routes/ProtectedRoute"
import { Toaster } from "react-hot-toast"
import MainLayout from "./components/layout/MainLayout"

import OrgEntry from "./pages/OrgEntry"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Dashboard from "./pages/Dashboard"
import Invite from "./pages/Invite"
import Documents from "./pages/Documents"
import AgentsPage from "./pages/Agents"
import ChatPage from "./pages/ChatPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "14px 16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              fontSize: "14px",
              fontWeight: "500",
            },
            success: {
              style: {
                borderLeft: "5px solid #10b981",
              },
            },
            error: {
              style: {
                borderLeft: "5px solid #ef4444",
              },
            },
          }}
        />
        
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<OrgEntry />} />
          <Route path="/:org/login" element={<Login />} />
          <Route path="/:org/forgot-password" element={<ForgotPassword />} />
          <Route path="/:org/invite/:token" element={<Invite />} />
          <Route path="/:org/reset-password/:uid/:token" element={<ResetPassword/> }/>

          {/* Protected Routes */}
          <Route
            path="/:org"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="docs" element={<Documents />} context={{ setTopBarActions: ()=> {}}}/>
            <Route path="agents" element={<AgentsPage />} context={{ setTopBarActions: ()=> {}}}/>
            <Route path="agents/:agentId/:chatId?" element={<ChatPage />} context={{ setTopBarActions: ()=> {}}}/>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}