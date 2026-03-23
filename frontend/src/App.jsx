import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./services/auth/AuthProvider"
import ProtectedRoute from "./services/routes/ProtectedRoute"

import MainLayout from "./components/layout/MainLayout"

import OrgEntry from "./pages/OrgEntry"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Invite from "./pages/Invite"
import Documents from "./pages/Documents"
import AgentsPage from "./pages/Agents"
import ChatPage from "./pages/ChatPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<OrgEntry />} />
          <Route path="/:org/login" element={<Login />} />
          <Route path="/:org/invite/:token" element={<Invite />} />

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

<Route path="/:org"
  
>
  <Route path="agents" element={<AgentsPage />} />
</Route>