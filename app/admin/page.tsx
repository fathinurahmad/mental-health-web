"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useFirebaseAuth } from "@/lib/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Users, UserCheck, UserX, LogOut, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: any
}

export default function AdminDashboard() {
  const { user, db, auth, loading: authLoading } = useFirebaseAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/")
      return
    }

    if (user && db) {
      fetchUsers()
    }
  }, [user, db, authLoading])

  const fetchUsers = async () => {
    if (!db) return

    try {
      const usersSnapshot = await getDocs(collection(db, "users"))
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[]
      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
    setLoading(false)
  }

  const updateUserStatus = async (userId: string, status: string) => {
    if (!db) return

    try {
      await updateDoc(doc(db, "users", userId), { status })
      fetchUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!db) return

    if (confirm("Yakin ingin menghapus user ini?")) {
      try {
        await deleteDoc(doc(db, "users", userId))
        fetchUsers()
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
      router.push("/")
    }
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  const pendingDoctors = users.filter((u) => u.role === "doctor" && u.status === "pending")
  const activeDoctors = users.filter((u) => u.role === "doctor" && u.status === "active")
  const patients = users.filter((u) => u.role === "patient")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokter Aktif</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDoctors.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dokter Pending</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingDoctors.length}</div>
            </CardContent>
          </Card>
        </div>

        {pendingDoctors.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Dokter Menunggu Persetujuan</CardTitle>
              <CardDescription>Dokter yang perlu diverifikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingDoctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateUserStatus(doctor.id, "active")}>
                        Setujui
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteUser(doctor.id)}>
                        Tolak
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Semua Pengguna</CardTitle>
            <CardDescription>Kelola semua pengguna sistem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "doctor" ? "secondary" : "outline"}
                      >
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === "active" ? "default" : "destructive"}>{user.status}</Badge>
                    </div>
                  </div>
                  {user.role !== "admin" && (
                    <div className="flex gap-2">
                      {user.status === "active" ? (
                        <Button size="sm" variant="outline" onClick={() => updateUserStatus(user.id, "inactive")}>
                          Nonaktifkan
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => updateUserStatus(user.id, "active")}>
                          Aktifkan
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                        Hapus
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
