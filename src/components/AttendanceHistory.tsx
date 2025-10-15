import React from 'react'

interface AttendanceHistoryProps {
  logs: any[]
  loading?: boolean
}

export default function AttendanceHistory({ logs, loading = false }: AttendanceHistoryProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return date.toLocaleString()
  }

  const calculateDuration = (login: Date | null, logout: Date | null) => {
    if (!login || !logout) return 'N/A'
    const durationMs = logout.getTime() - login.getTime()
    const hours = Math.floor(durationMs / (1000 * 60 * 60))
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginBottom: '20px' }}>Attendance History</h3>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Loading attendance history...</div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
          No attendance records available.
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                  Date
                </th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                  Login Time
                </th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                  Logout Time
                </th>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                    {log.loginTimestamp?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                    {formatDate(log.loginTimestamp)}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                    {formatDate(log.logoutTimestamp)}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #dee2e6' }}>
                    {calculateDuration(log.loginTimestamp, log.logoutTimestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}