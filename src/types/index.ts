export interface GoldEntry {
  id: string
  amount: number
  notes: string
  timestamp: Date
  userId: string
}

export interface AttendanceLog {
  id: string
  loginTimestamp: Date | null
  logoutTimestamp: Date | null
  userId: string
}