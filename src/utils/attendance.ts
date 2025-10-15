import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

export async function recordLogin(userId: string) {
  try {
    const attendanceRef = doc(db, 'attendance', userId, 'logs', Date.now().toString())
    await setDoc(attendanceRef, {
      loginTimestamp: serverTimestamp(),
      logoutTimestamp: null
    })
  } catch (error) {
    console.error('Error recording login:', error)
  }
}

export async function recordLogout(userId: string) {
  try {
    const attendanceRef = doc(db, 'attendance', userId, 'logs', Date.now().toString())
    await setDoc(attendanceRef, {
      loginTimestamp: null,
      logoutTimestamp: serverTimestamp()
    })
  } catch (error) {
    console.error('Error recording logout:', error)
  }
}

export function setupAttendanceTracking() {
  let currentUserId: string | null = null

  const handleBeforeUnload = () => {
    if (currentUserId) {
      recordLogout(currentUserId)
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)

  return {
    setUserId: (userId: string) => {
      currentUserId = userId
    },
    cleanup: () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }
}