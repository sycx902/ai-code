import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UserDocument } from '../utils/userManagement'
import { getAllUsers, createRegularUser, deactivateUser, activateUser } from '../utils/adminManagement'

export default function AdminPanel() {
  const { currentUser } = useAuth()
  const [users, setUsers] = useState<UserDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' })
  const [createLoading, setCreateLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const userList = await getAllUsers()
      setUsers(userList)
    } catch (error) {
      console.error('Error loading users:', error)
      alert('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.email || !newUser.password || !newUser.name) {
      alert('Please fill all fields')
      return
    }

    setCreateLoading(true)
    try {
      await createRegularUser(newUser.email, newUser.password, newUser.name)
      setNewUser({ email: '', password: '', name: '' })
      setShowCreateForm(false)
      await loadUsers()
      alert('User created successfully!')
    } catch (error: any) {
      console.error('Error creating user:', error)
      alert('Failed to create user: ' + (error.message || 'Unknown error'))
    } finally {
      setCreateLoading(false)
    }
  }

  const handleToggleUserStatus = async (userNameSlug: string, isActive: boolean) => {
    try {
      if (isActive) {
        await deactivateUser(userNameSlug)
      } else {
        await activateUser(userNameSlug)
      }
      await loadUsers()
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Failed to update user status')
    }
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading admin panel...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>Admin Panel</h2>
        <p style={{ color: '#666' }}>Manage users and system settings</p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          {showCreateForm ? 'Cancel' : 'Create New User'}
        </button>
      </div>

      {showCreateForm && (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h3>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
                Email:
              </label>
              <input
                type="email"
                id="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={createLoading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: createLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3>Users</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Slug</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userNameSlug} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={{ padding: '10px' }}>{user.userNameSlug}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>
                  <code style={{ backgroundColor: '#f8f9fa', padding: '2px 6px', borderRadius: '3px' }}>
                    /{user.userNameSlug}
                  </code>
                </td>
                <td style={{ padding: '10px' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: user.isActive ? '#d4edda' : '#f8d7da',
                      color: user.isActive ? '#155724' : '#721c24'
                    }}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleToggleUserStatus(user.userNameSlug, user.isActive)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: user.isActive ? '#ffc107' : '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}