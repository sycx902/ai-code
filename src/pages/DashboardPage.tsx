import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { GoldEntry } from '../types'
import { addGoldEntry, updateGoldEntry, deleteGoldEntry, subscribeToGoldEntries, subscribeToAttendanceLogs } from '../utils/goldManagement'
import GoldEntryForm from '../components/GoldEntryForm'
import GoldEntryList from '../components/GoldEntryList'
import AttendanceHistory from '../components/AttendanceHistory'

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const [goldEntries, setGoldEntries] = useState<GoldEntry[]>([])
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<GoldEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)

  async function handleLogout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    if (!currentUser?.uid) return

    const unsubscribeGold = subscribeToGoldEntries(currentUser.uid, (entries) => {
      setGoldEntries(entries)
    })

    const unsubscribeAttendance = subscribeToAttendanceLogs(currentUser.uid, (logs) => {
      setAttendanceLogs(logs)
    })

    setLoading(false)

    return () => {
      unsubscribeGold()
      unsubscribeAttendance()
    }
  }, [currentUser?.uid])

  const handleAddEntry = async (amount: number, notes: string) => {
    if (!currentUser?.uid) return
    
    setFormLoading(true)
    try {
      await addGoldEntry(currentUser.uid, amount, notes)
      setShowAddForm(false)
    } catch (error) {
      console.error('Error adding gold entry:', error)
      alert('Failed to add gold entry. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateEntry = async (amount: number, notes: string) => {
    if (!editingEntry?.id) return
    
    setFormLoading(true)
    try {
      await updateGoldEntry(editingEntry.id, amount, notes)
      setEditingEntry(null)
    } catch (error) {
      console.error('Error updating gold entry:', error)
      alert('Failed to update gold entry. Please try again.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await deleteGoldEntry(entryId)
    } catch (error) {
      console.error('Error deleting gold entry:', error)
      alert('Failed to delete gold entry. Please try again.')
    }
  }

  const totalGold = goldEntries.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#333' }}>Dashboard</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Welcome, {currentUser?.email}</p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#dc3545', 
            color: 'white', 
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Gold Summary</h3>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              {totalGold.toFixed(2)} units
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Total across {goldEntries.length} entries
            </div>
          </div>

          {!showAddForm && !editingEntry && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '20px'
              }}
            >
              Add Gold Entry
            </button>
          )}

          {(showAddForm || editingEntry) && (
            <GoldEntryForm
              entry={editingEntry || undefined}
              onSubmit={editingEntry ? handleUpdateEntry : handleAddEntry}
              onCancel={() => {
                setShowAddForm(false)
                setEditingEntry(null)
              }}
              loading={formLoading}
            />
          )}

          <GoldEntryList
            entries={goldEntries}
            onEdit={setEditingEntry}
            onDelete={handleDeleteEntry}
            loading={loading}
          />
        </div>

        <div>
          <AttendanceHistory
            logs={attendanceLogs}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}