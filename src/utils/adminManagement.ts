import { doc, setDoc, collection, getDocs, query, where, getDoc } from 'firebase/firestore'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { UserDocument, generateUserNameSlug } from './userManagement'
import { db } from '../firebase'

export async function createAdminUser(email: string, password: string, name: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    await updateProfile(user, { displayName: name })
    
    const userNameSlug = generateUserNameSlug(email, name)
    
    const userDoc: UserDocument = {
      userId: user.uid,
      userNameSlug,
      email: user.email || email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isAdmin: true
    }
    
    await setDoc(doc(db, 'users', userNameSlug), userDoc)
    
    return { user, userNameSlug }
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

export async function createRegularUser(email: string, password: string, name: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    await updateProfile(user, { displayName: name })
    
    const userNameSlug = generateUserNameSlug(email, name)
    
    const userDoc: UserDocument = {
      userId: user.uid,
      userNameSlug,
      email: user.email || email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      isAdmin: false
    }
    
    await setDoc(doc(db, 'users', userNameSlug), userDoc)
    
    return { user, userNameSlug }
  } catch (error) {
    console.error('Error creating regular user:', error)
    throw error
  }
}

export async function getAllUsers() {
  try {
    const usersQuery = query(collection(db, 'users'))
    const querySnapshot = await getDocs(usersQuery)
    
    const users: UserDocument[] = []
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserDocument)
    })
    
    return users
  } catch (error) {
    console.error('Error fetching all users:', error)
    throw error
  }
}

export async function deactivateUser(userNameSlug: string) {
  try {
    const userRef = doc(db, 'users', userNameSlug)
    await setDoc(userRef, {
      isActive: false,
      updatedAt: new Date()
    }, { merge: true })
  } catch (error) {
    console.error('Error deactivating user:', error)
    throw error
  }
}

export async function activateUser(userNameSlug: string) {
  try {
    const userRef = doc(db, 'users', userNameSlug)
    await setDoc(userRef, {
      isActive: true,
      updatedAt: new Date()
    }, { merge: true })
  } catch (error) {
    console.error('Error activating user:', error)
    throw error
  }
}

export function generateUniqueSlug(email: string, name: string): string {
  let baseSlug = generateUserNameSlug(email, name)
  let counter = 1
  let uniqueSlug = baseSlug
  
  while (true) {
    if (!isSlugTaken(uniqueSlug)) {
      return uniqueSlug
    }
    uniqueSlug = `${baseSlug}-${counter}`
    counter++
  }
}

async function isSlugTaken(slug: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', slug)
    const userSnapshot = await getDoc(userRef)
    return userSnapshot.exists()
  } catch (error) {
    console.error('Error checking slug availability:', error)
    return true
  }
}