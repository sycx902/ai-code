import { doc, setDoc, collection, query, where, onSnapshot, orderBy, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { GoldEntry } from '../types'

export async function addGoldEntry(userId: string, amount: number, notes: string) {
  try {
    const goldRef = doc(collection(db, 'goldEntries'))
    const entry: Omit<GoldEntry, 'id'> = {
      amount,
      notes,
      timestamp: new Date(),
      userId
    }
    await setDoc(goldRef, entry)
    return goldRef.id
  } catch (error) {
    console.error('Error adding gold entry:', error)
    throw error
  }
}

export async function updateGoldEntry(entryId: string, amount: number, notes: string) {
  try {
    const entryRef = doc(db, 'goldEntries', entryId)
    await updateDoc(entryRef, {
      amount,
      notes,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating gold entry:', error)
    throw error
  }
}

export async function deleteGoldEntry(entryId: string) {
  try {
    const entryRef = doc(db, 'goldEntries', entryId)
    await deleteDoc(entryRef)
  } catch (error) {
    console.error('Error deleting gold entry:', error)
    throw error
  }
}

export function subscribeToGoldEntries(userId: string, callback: (entries: GoldEntry[]) => void) {
  const q = query(
    collection(db, 'goldEntries'),
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  )

  return onSnapshot(q, (querySnapshot) => {
    const entries: GoldEntry[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      entries.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      } as GoldEntry)
    })
    callback(entries)
  })
}

export function subscribeToAttendanceLogs(userId: string, callback: (logs: any[]) => void) {
  const q = query(
    collection(db, 'attendance', userId, 'logs'),
    orderBy('loginTimestamp', 'desc')
  )

  return onSnapshot(q, (querySnapshot) => {
    const logs: any[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      logs.push({
        id: doc.id,
        ...data,
        loginTimestamp: data.loginTimestamp?.toDate(),
        logoutTimestamp: data.logoutTimestamp?.toDate()
      })
    })
    callback(logs)
  })
}