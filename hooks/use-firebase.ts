"use client"

import { useState, useEffect } from "react"
import { initializeApp, getApps } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
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

export function useFirebase() {
  const [auth, setAuth] = useState<Auth | null>(null)
  const [db, setDb] = useState<Firestore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initFirebase = async () => {
      try {
        // Check if all required env vars are present
        const requiredVars = [
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        ]

        if (requiredVars.some((v) => !v)) {
          throw new Error("Missing Firebase configuration. Please check your environment variables.")
        }

        // Initialize Firebase
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

        const authInstance = getAuth(app)
        const dbInstance = getFirestore(app)

        setAuth(authInstance)
        setDb(dbInstance)
        setError(null)
      } catch (err: any) {
        console.error("Firebase initialization error:", err)
        setError(err.message || "Failed to initialize Firebase")
      } finally {
        setLoading(false)
      }
    }

    initFirebase()
  }, [])

  return { auth, db, loading, error }
}
