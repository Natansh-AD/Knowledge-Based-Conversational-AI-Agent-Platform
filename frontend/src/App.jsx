import { Routes, Route, Navigate } from "react-router-dom"
import TenantLogin from "./pages/tenant_login"
import Login from "./pages/user_login"
import Home from "./pages/home"

function App() {
  return (
    <Routes>
      <Route path="/" element={<TenantLogin />} />
      <Route path=":tenant/login" element={<Login />} />
      <Route path=":tenant/home" element={<Home />} />
    </Routes>
  )
}

export default App