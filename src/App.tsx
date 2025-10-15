import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UserRoute from './components/UserRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<div>
              <h1>User Attendance App</h1>
              <p>Welcome to the User Attendance App</p>
              <p>Please use your unique URL to access your dashboard.</p>
              <p>Example: /john-doe</p>
            </div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/:userNameSlug" 
              element={<UserRoute />} 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App