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

// Initialize Firebase only on client side
let auth: Auth
let db: Firestore

const initializeFirebase = () => {
  if (typeof window !== "undefined" && !getApps().length) {
    try {
      const app = initializeApp(firebaseConfig)
      auth = getAuth(app)
      db = getFirestore(app)
      console.log("Firebase initialized successfully")
      return { auth, db }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      throw error
    }
  }
  return { auth, db }
}

// Only initialize on client side
if (typeof window !== "undefined") {
  const firebase = initializeFirebase()
  auth = firebase.auth
  db = firebase.db
}

export { auth, db }
