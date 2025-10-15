import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export interface UserDocument {
  userId: string
  userNameSlug: string
  email: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  isAdmin?: boolean
}

export async function createUser(userData: Omit<UserDocument, 'createdAt' | 'updatedAt'>) {
  try {
    const userRef = doc(db, 'users', userData.userNameSlug)
    const userDoc: UserDocument = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    await setDoc(userRef, userDoc)
    return userDoc
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function getUserBySlug(userNameSlug: string): Promise<UserDocument | null> {
  try {
    const userRef = doc(db, 'users', userNameSlug)
    const userSnapshot = await getDoc(userRef)
    
    if (userSnapshot.exists()) {
      return userSnapshot.data() as UserDocument
    }
    return null
  } catch (error) {
    console.error('Error fetching user by slug:', error)
    throw error
  }
}

export async function updateUser(userNameSlug: string, updates: Partial<UserDocument>) {
  try {
    const userRef = doc(db, 'users', userNameSlug)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export function generateUserNameSlug(email: string, name?: string): string {
  const baseName = name || email.split('@')[0]
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-')
  
  return slug || 'user-' + Math.random().toString(36).substr(2, 9)
}