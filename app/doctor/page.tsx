"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, updateDoc, doc, addDoc, serverTimestamp } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useFirebaseAuth } from "@/lib/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Stethoscope, MessageCircle, CheckCircle, XCircle, LogOut, PenTool, Save, Eye, X } from "lucide-react"
import ChatComponent from "@/components/chat-component"

interface Consultation {
  id: string
  doctorId: string
  doctorName: string
  patientId: string
  patientName: string
  complaint: string
  status: string
  createdAt: any
}

export default function DoctorDashboard() {
  const { user, db, auth, loading: authLoading } = useFirebaseAuth()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [articleData, setArticleData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "anxiety",
    readTime: "5"
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/")
      return
    }

    if (user && db) {
      fetchConsultations()
    }
  }, [user, db, authLoading])

  const fetchConsultations = async () => {
    if (!db || !user) return

    try {
      const consultationsQuery = query(
        collection(db, "consultations"),
        where("doctorId", "==", user.uid),
        orderBy("createdAt", "desc"),
      )

      const consultationsSnapshot = await getDocs(consultationsQuery)
      const consultationsData = consultationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Consultation[]

      setConsultations(consultationsData)
    } catch (error) {
      console.error("Error fetching consultations:", error)
    }
    setLoading(false)
  }

  const updateConsultationStatus = async (consultationId: string, status: string) => {
    if (!db) return
    try {
      await updateDoc(doc(db, "consultations", consultationId), { status })
      fetchConsultations()
    } catch (error) {
      console.error("Error updating consultation:", error)
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
      router.push("/")
    }
  }

  const handleArticleSubmit = async () => {
    if (!articleData.title.trim() || !articleData.excerpt.trim() || !articleData.content.trim()) {
      alert("Semua field harus diisi")
      return
    }
    
    if (!db || !user) {
      alert("Database atau user tidak tersedia")
      return
    }
    
    setSubmitting(true)
    try {
      await addDoc(collection(db, "articles"), {
        ...articleData,
        readTime: `${articleData.readTime} menit`,
        authorId: user.uid,
        authorName: user.displayName || user.email || "Dokter",
        rating: 0,
        totalRatings: 0,
        views: 0,
        status: "published",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      alert("Artikel berhasil dipublikasikan!")
      setArticleData({
        title: "",
        excerpt: "",
        content: "",
        category: "anxiety",
        readTime: "5"
      })
      setShowArticleModal(false)
    } catch (error) {
      console.error("Error publishing article:", error)
      alert("Gagal mempublikasikan artikel.")
    }
    setSubmitting(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const pendingConsultations = consultations.filter((c) => c.status === "pending")
  const confirmedConsultations = consultations.filter((c) => c.status === "confirmed")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Dokter</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowArticleModal(true)}>
              <PenTool className="h-4 w-4 mr-2" />
              Tulis Artikel
            </Button>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Konsultasi</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{consultations.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Konfirmasi</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{pendingConsultations.length}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Dikonfirmasi</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{confirmedConsultations.length}</div></CardContent>
          </Card>
        </div>

        {/* Pending consultations */}
        {pendingConsultations.length > 0 && (
          <Card className="mb-8">
            <CardHeader><CardTitle>Konsultasi Menunggu Konfirmasi</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingConsultations.map((c) => (
                  <div key={c.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{c.patientName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{c.complaint}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {c.createdAt?.toDate?.()?.toLocaleDateString() || "Tanggal tidak tersedia"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => updateConsultationStatus(c.id, "confirmed")}>
                        <CheckCircle className="h-4 w-4 mr-1" />Konfirmasi
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => updateConsultationStatus(c.id, "rejected")}>
                        <XCircle className="h-4 w-4 mr-1" />Tolak
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active consultations */}
        <Card>
          <CardHeader><CardTitle>Konsultasi Aktif</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {confirmedConsultations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada konsultasi aktif</p>
              ) : (
                confirmedConsultations.map((c) => (
                  <div key={c.id} className="border rounded-lg p-4 flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{c.patientName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{c.complaint}</p>
                      <Badge className="mt-2">{c.status}</Badge>
                    </div>
                    <Button size="sm" onClick={() => setSelectedChat(c.id)}>
                      <MessageCircle className="h-4 w-4 mr-2" />Chat
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Chat component */}
      {selectedChat && (
        <ChatComponent consultationId={selectedChat} currentUserId={user.uid} onClose={() => setSelectedChat(null)} />
      )}

      {/* Modal Article */}
      {showArticleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center"><PenTool className="h-5 w-5 mr-2" />Tulis Artikel</h2>
              <Button variant="outline" size="sm" onClick={() => setShowArticleModal(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Judul Artikel" className="w-full p-3 border rounded" value={articleData.title} onChange={(e) => setArticleData({...articleData, title: e.target.value})}/>
              <textarea placeholder="Ringkasan" className="w-full p-3 border rounded" rows={3} value={articleData.excerpt} onChange={(e) => setArticleData({...articleData, excerpt: e.target.value})}/>
              <textarea placeholder="Konten" className="w-full p-3 border rounded" rows={8} value={articleData.content} onChange={(e) => setArticleData({...articleData, content: e.target.value})}/>
              <div className="flex gap-4">
                <input type="number" min="1" max="60" className="w-1/2 p-3 border rounded" placeholder="Waktu baca (menit)" value={articleData.readTime} onChange={(e) => setArticleData({...articleData, readTime: e.target.value})}/>
                <select className="w-1/2 p-3 border rounded" value={articleData.category} onChange={(e) => setArticleData({...articleData, category: e.target.value})}>
                  <option value="anxiety">Kecemasan</option>
                  <option value="depression">Depresi</option>
                  <option value="stress">Stres</option>
                  <option value="sleep">Tidur</option>
                  <option value="relationships">Hubungan</option>
                </select>
              </div>
              <Button className="w-full" onClick={handleArticleSubmit} disabled={submitting}>
                {submitting ? <><div className="animate-spin h-4 w-4 border-b-2 border-white mr-2 rounded-full"></div>Mempublikasikan...</> : <><Save className="h-4 w-4 mr-2"/>Publikasikan</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}