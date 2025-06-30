"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getAuth, type Auth, onAuthStateChanged, type User } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAzipjqGHdrcWFa3n16kzrrZr1VN6N5K6E",
  authDomain: "mental-49dfd.firebaseapp.com",
  projectId: "mental-49dfd",
  storageBucket: "mental-49dfd.firebasestorage.app",
  messagingSenderId: "448236339373",
  appId: "1:448236339373:web:c0d7f24e32ba1ae2218624",
  measurementId: "G-8Y4S2RX8VD",
}

interface FirebaseContextType {
  auth: Auth | null
  db: Firestore | null
  user: User | null
  loading: boolean
  error: string | null
}

const FirebaseContext = createContext<FirebaseContextType>({
  auth: null,
  db: null,
  user: null,
  loading: true,
  error: null,
})

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebaseAuth must be used within a FirebaseProvider")
  }
  return context
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [db, setDb] = useState<Firestore | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Initialize Firebase
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

        const authInstance = getAuth(app)
        const dbInstance = getFirestore(app)

        setAuth(authInstance)
        setDb(dbInstance)

        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
          setUser(user)
          setLoading(false)
        })

        return unsubscribe
      } catch (err: any) {
        console.error("Firebase initialization error:", err)
        setError(err.message || "Failed to initialize Firebase")
        setLoading(false)
      }
    }

    const unsubscribe = initFirebase()

    
  }, [])

  return <FirebaseContext.Provider value={{ auth, db, user, loading, error }}>{children}</FirebaseContext.Provider>
}
