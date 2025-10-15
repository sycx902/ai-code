import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface UserData {
  userId: string
  userNameSlug: string
  email: string
}

export function useUserSlug(userNameSlug: string | undefined) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userNameSlug) {
      setError('User slug is required')
      setLoading(false)
      return
    }

    async function fetchUserData() {
      try {
        const userDoc = doc(db, 'users', userNameSlug)
        const userSnapshot = await getDoc(userDoc)

        if (userSnapshot.exists()) {
          const data = userSnapshot.data() as UserData
          setUserData(data)
        } else {
          setError('User not found')
        }
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userNameSlug])

  return { userData, loading, error }
}