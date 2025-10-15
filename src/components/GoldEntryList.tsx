import React from 'react'
import { GoldEntry } from '../types'

interface GoldEntryListProps {
  entries: GoldEntry[]
  onEdit: (entry: GoldEntry) => void
  onDelete: (entryId: string) => void
  loading?: boolean
}

export default function GoldEntryList({ entries, onEdit, onDelete, loading = false }: GoldEntryListProps) {
  const totalGold = entries.reduce((sum, entry) => sum + entry.amount, 0)

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h3>Gold Entries</h3>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
          Total: {totalGold.toFixed(2)}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading gold entries...</div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No gold entries yet. Add your first entry above!
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                padding: '15px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}>
                    {entry.amount.toFixed(2)} units
                  </div>
                  {entry.notes && (
                    <div style={{ color: '#666', marginBottom: '8px' }}>
                      {entry.notes}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={() => onEdit(entry)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this entry?')) {
                        onDelete(entry.id)
                      }
                    }}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}