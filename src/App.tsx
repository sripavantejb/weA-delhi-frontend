import { BrowserRouter, Navigate, Outlet, Routes, Route, useLocation } from 'react-router-dom'
import { getToken } from './api/client'
import { AppLayout } from './components/AppLayout'
import { ContentPlanner } from './pages/ContentPlanner'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import './App.css'

function ProtectedRoute() {
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}

function PublicRoute() {
  const token = getToken()
  const location = useLocation()
  if (token) return <Navigate to={location.state?.from?.pathname || '/'} replace />
  return <Outlet />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<ContentPlanner />} />
            <Route path="/email" element={<PlaceholderPage title="Email Sender" />} />
            <Route path="/invoicing" element={<PlaceholderPage title="Invoicing" />} />
            <Route path="/appointments" element={<PlaceholderPage title="Appointments" />} />
            <Route path="/call-agent" element={<PlaceholderPage title="Call Agent" />} />
            <Route path="/video-creator" element={<PlaceholderPage title="Video Creator" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
            <Route path="/help" element={<PlaceholderPage title="Help" />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
