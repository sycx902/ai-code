import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUserSlug } from '../hooks/useUserSlug'
import LoginPage from '../components/LoginPage'

export default function UserRoute() {
  const { userNameSlug } = useParams<{ userNameSlug: string }>()
  const { currentUser } = useAuth()
  const { userData, loading, error } = useUserSlug(userNameSlug)

  if (loading) {
    return <div>Loading user data...</div>
  }

  if (error || !userData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>User Not Found</h2>
        <p>The user "{userNameSlug}" does not exist or the URL is incorrect.</p>
      </div>
    )
  }

  if (!currentUser) {
    return <LoginPage targetUserId={userData.userId} />
  }

  if (currentUser.uid !== userData.userId) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Access Denied</h2>
        <p>You can only access your own dashboard.</p>
      </div>
    )
  }

  return <Navigate to="/dashboard" replace />
}