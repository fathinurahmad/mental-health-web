"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import type React from "react"

import { Bot } from "lucide-react"
import { useState, useEffect } from "react"
import { collection, getDocs, addDoc, query, where, orderBy, doc, getDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { useFirebaseAuth } from "@/lib/contexts/firebase-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { 
  MessageCircle, 
  Heart, 
  LogOut, 
  Plus, 
  Stethoscope, 
  Calendar, 
  Clock,
  Smile,
  Meh,
  Frown,
  Angry,
  Zap,
  TrendingUp,
  Send,
  BookOpen,
  Brain

} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ChatComponent from "@/components/chat-component"

interface Doctor {
  id: string
  name: string
  email: string
}

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

interface UserData {
  username?: string
  email?: string
  name?: string
}

interface MoodEntry {
  id: string
  userId: string
  mood: number
  note: string
  createdAt: any
}

const moodEmojis = [
  { value: 1, emoji: "😢", label: "Sangat Sedih", color: "text-red-500" },
  { value: 2, emoji: "😔", label: "Sedih", color: "text-orange-500" },
  { value: 3, emoji: "😐", label: "Biasa", color: "text-yellow-500" },
  { value: 4, emoji: "😊", label: "Senang", color: "text-green-500" },
  { value: 5, emoji: "😄", label: "Sangat Senang", color: "text-emerald-500" }
]

export default function PatientDashboard() {
  const { user, db, auth, loading: authLoading } = useFirebaseAuth()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [complaint, setComplaint] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [moodNote, setMoodNote] = useState("")
  const [showMoodDialog, setShowMoodDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/")
      return
    }

    if (user && db) {
      fetchData()
    }
  }, [user, db, authLoading])

  const fetchData = async () => {
    if (!db || !user) return

    try {
      // Fetch user data to get username
      const userDocRef = doc(db, "users", user.uid)
      const userDocSnap = await getDoc(userDocRef)
      
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as UserData)
      }

      // Fetch active doctors
      const doctorsQuery = query(
        collection(db, "users"),
        where("role", "==", "doctor"),
        where("status", "==", "active"),
      )
      const doctorsSnapshot = await getDocs(doctorsQuery)
      const doctorsData = doctorsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Doctor[]
      setDoctors(doctorsData)

      // Fetch patient's consultations with orderBy (after creating index)
      const consultationsQuery = query(
        collection(db, "consultations"),
        where("patientId", "==", user.uid),
        orderBy("createdAt", "desc"),
      )
      const consultationsSnapshot = await getDocs(consultationsQuery)
      const consultationsData = consultationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Consultation[]
      setConsultations(consultationsData)

      // Fetch mood entries
      const moodQuery = query(
        collection(db, "moodEntries"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      )
      const moodSnapshot = await getDocs(moodQuery)
      const moodData = moodSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MoodEntry[]
      setMoodEntries(moodData)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
    setLoading(false)
  }

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDoctor || !complaint || !db || !user) return

    try {
      const doctor = doctors.find((d) => d.id === selectedDoctor)
      // Use username if available, otherwise fallback to displayName or email
      const patientName = userData?.username || user.displayName || user.email || "Unknown User"
      
      await addDoc(collection(db, "consultations"), {
        doctorId: selectedDoctor,
        doctorName: doctor?.name,
        patientId: user.uid,
        patientName: patientName,
        complaint,
        status: "pending",
        createdAt: new Date(),
      })

      setSelectedDoctor("")
      setComplaint("")
      fetchData()
      alert("Konsultasi berhasil dibuat!")
    } catch (error) {
      console.error("Error booking consultation:", error)
      alert("Gagal membuat konsultasi")
    }
  }

  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMood || !db || !user) return

    try {
      await addDoc(collection(db, "moodEntries"), {
        userId: user.uid,
        mood: selectedMood,
        note: moodNote,
        createdAt: new Date(),
      })

      setSelectedMood(null)
      setMoodNote("")
      setShowMoodDialog(false)
      fetchData()
      alert("Mood berhasil dicatat!")
    } catch (error) {
      console.error("Error saving mood:", error)
      alert("Gagal menyimpan mood")
    }
  }

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth)
      router.push("/")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-red-100 text-red-800 border-red-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Dikonfirmasi"
      case "pending":
        return "Menunggu"
      default:
        return "Ditolak"
    }
  }

  // Get display name with priority: username > name > displayName > email
  const getDisplayName = () => {
    return userData?.username || 
           userData?.name || 
           user?.displayName || 
           user?.email || 
           "Pengguna"
  }

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0
    const sum = moodEntries.slice(0, 7).reduce((acc, entry) => acc + entry.mood, 0)
    return (sum / Math.min(moodEntries.length, 7)).toFixed(1)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-peach-50 to-orange-50">
        <div className="text-center">
          <Heart className="h-12 w-12 text-peach-500 animate-pulse mx-auto mb-4" />
          <p className="text-peach-700 text-lg">Sabar yah...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-peach-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
          <div className="flex items-start sm:items-center space-x-4">
            <div className="p-2 bg-peach-100 rounded-xl">
              <Heart className="h-8 w-8 text-[#944D8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">MindCare</h1>
              <p className="text-sm text-[#944D8A]">
                Selamat datang, <span className="font-semibold">{getDisplayName()}</span>
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-peach-200 text-peach-700 hover:bg-peach-50 hover:border-peach-300 transition-all duration-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>
    </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="mb-8">
  <Card className="bg-[#FDEFF7] border border-[#FADCEB] shadow-xl rounded-2xl">
    <CardContent className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-6 space-y-6 lg:space-y-0">
        
        {/* Icon */}
        <div className="p-3 bg-white rounded-full shadow-md self-center lg:self-start">
          <Heart className="h-8 w-8 text-[#944D8A]" />
        </div>
        
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Prioritaskan Kesehatan Mental Anda
          </h2>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Konsultasi dengan psikolog dan psikiater berpengalaman untuk kesejahteraan mental yang lebih baik.
          </p>
        </div>

        {/* Button Section */}
        <div className="flex flex-wrap justify-center lg:justify-end gap-2">
          <Button
            onClick={() => setShowMoodDialog(true)}
            className="flex items-center gap-2 py-2 px-4 text-sm bg-[#944D8A] hover:bg-[#7a3d72] text-white rounded-md shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
          >
            <Heart className="h-4 w-4" />
            Catat Mood
          </Button>

          <Button
            onClick={() => router.push("/artikel")}
            className="flex items-center gap-2 py-2 px-4 text-sm bg-[#944D8A] hover:bg-[#7a3d72] text-white rounded-md shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
          >
            <BookOpen className="h-4 w-4" />
            Lihat Artikel
          </Button>

          <Button
            onClick={() => router.push("/ai")}
            className="flex items-center gap-2 py-2 px-4 text-sm bg-[#944D8A] hover:bg-[#7a3d72] text-white rounded-md shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
          >
            <Bot className="h-4 w-4" />
            Konsultasi AI
          </Button>

          <Button
  onClick={() => router.push("/mentaltest")}
  className="flex items-center gap-2 py-2 px-4 text-sm bg-[#944D8A] hover:bg-[#7a3d72] text-white rounded-md shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
>
  <Brain className="h-4 w-4" />
  Tes Mental
</Button>

        </div>
      </div>
    </CardContent>
  </Card>
</div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Mood Tracker Section */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <div>
                    <CardTitle className="text-gray-800">Mood Tracker</CardTitle>
                    <CardDescription className="text-gray-600">
                      Rata-rata mood 7 hari terakhir: {getAverageMood()}/5
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {moodEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <Smile className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">Belum ada catatan mood</p>
                      <p className="text-gray-400 text-sm mt-2">Mulai catat mood harian Anda untuk tracking yang lebih baik</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {moodEntries.slice(0, 4).map((entry) => {
                        const moodData = moodEmojis.find(m => m.value === entry.mood)
                        return (
                          <div key={entry.id} className="p-4 border border-purple-100 rounded-lg bg-gradient-to-r from-white to-purple-50/30">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">{moodData?.emoji}</span>
                              <div className="flex-1">
                                <p className={`font-medium ${moodData?.color}`}>{moodData?.label}</p>
                                <p className="text-xs text-gray-500">
                                  {entry.createdAt?.toDate?.()?.toLocaleDateString('id-ID') || "Tanggal tidak tersedia"}
                                </p>
                              </div>
                            </div>
                            {entry.note && (
                              <p className="text-sm text-gray-600 italic">"{entry.note}"</p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Consultations Section */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
  <CardHeader className="bg-gradient-to-r from-peach-50 to-orange-50 rounded-t-lg">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center space-x-3">
        <Calendar className="h-6 w-6 text-peach-600" />
        <div>
          <CardTitle className="text-gray-800">Riwayat Konsultasi</CardTitle>
          <CardDescription className="text-gray-600">
            Lihat catatan dan interaksi sebelumnya
          </CardDescription>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-[#944D8A] hover:bg-[#7a3d72] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Plus className="h-4 w-4 mr-2" />
            Konsultasi Baru
          </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-peach-200 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-gray-800 flex items-center">
                          <Heart className="h-5 w-5 text-peach-600 mr-2" />
                          Mulai Konsultasi Baru
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Pilih psikolog atau psikiater yang sesuai dengan kebutuhan Anda
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleBookConsultation} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="doctor" className="text-gray-700 font-medium">Pilih Tenaga Profesional</Label>
                          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                            <SelectTrigger className="border-peach-200 focus:border-peach-400 transition-colors">
                              <SelectValue placeholder="Pilih psikolog atau psikiater" />
                            </SelectTrigger>
                            <SelectContent>
                              {doctors.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.id}>
                                  <div className="flex items-center space-x-2">
                                    <Stethoscope className="h-4 w-4 text-peach-600" />
                                    <span>{doctor.name}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="complaint" className="text-gray-700 font-medium">Ceritakan Keluhan Anda</Label>
                          <Textarea
                            id="complaint"
                            value={complaint}
                            onChange={(e) => setComplaint(e.target.value)}
                            placeholder="Ceritakan apa yang sedang Anda rasakan atau alami. Informasi ini akan membantu kami memberikan layanan terbaik untuk Anda..."
                            className="border-peach-200 focus:border-peach-400 min-h-[120px] transition-colors"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-[#944D8A] hover:bg-[#7a3d72] text-white shadow-lg transition-all duration-300">
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Konsultasi
                      </Button>

                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
    {consultations.length === 0 ? (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-peach-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Belum ada riwayat konsultasi</p>
        <p className="text-gray-400 text-sm mt-2">Mulai perjalanan kesehatan mental Anda dengan konsultasi pertama</p>
      </div>
    ) : (
      consultations.map((consultation) => (
        <div
          key={consultation.id}
          className="border border-peach-100 rounded-xl p-6 bg-gradient-to-r from-white to-peach-50/30 hover:shadow-md transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-1 bg-peach-100 rounded-full">
                  <Stethoscope className="h-4 w-4 text-peach-600" />
                </div>
                <h3 className="font-semibold text-gray-800">{consultation.doctorName}</h3>
              </div>
              <p className="text-gray-600 mb-2 leading-relaxed">{consultation.complaint}</p>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>
                  {consultation.createdAt?.toDate?.()?.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) || "Tanggal tidak tersedia"}
                </span>
              </div>
            </div>

            <Badge className={`${getStatusColor(consultation.status)} px-3 py-1 font-medium border`}>
              {getStatusText(consultation.status)}
            </Badge>
          </div>

          {consultation.status === "confirmed" && (
            <Button
              size="sm"
              onClick={() => setSelectedChat(consultation.id)}
              className="bg-[#944D8A] hover:bg-[#7a3d72] text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Mulai Chat
            </Button>
          )}
        </div>
      ))
    )}
  </div>
</CardContent>

            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

{/* Mental Health Tips Card */}
<Card className="shadow-lg border-0 bg-gradient-to-br from-peach-100 to-orange-100">
              <CardHeader>
                <CardTitle className="text-gray-800 flex items-center">
                  <Heart className="h-5 w-5 text-peach-600 mr-2" />
                  Motivasi Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>💭 "Merawat diri bukan egois, itu perlu."</p>
                  <p>🌱 "Tidak apa-apa untuk tidak baik-baik saja."</p>
                  <p>🤝 "Tenang bukan lemah, itu kekuatan."</p>
                  <p>🏃‍♀️ "Kesehatan mental sama pentingnya dengan fisik."</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
  <CardHeader className="bg-gradient-to-r from-peach-50 to-orange-50 rounded-t-lg">
    <div className="flex items-center space-x-2">
      <Heart className="h-5 w-5 text-peach-600" />
      <CardTitle className="text-gray-800">Tenaga Profesional</CardTitle>
    </div>
    <CardDescription className="text-gray-600">
      Psikolog dan psikiater tersedia
    </CardDescription>
  </CardHeader>

  <CardContent className="p-6">
    <div
      className={`space-y-4 ${
        doctors.length > 6 ? 'max-h-[400px] overflow-y-auto pr-2' : ''
      } scrollbar-thin scrollbar-thumb-peach-300 scrollbar-track-peach-100`}
    >
      {doctors.length === 0 ? (
        <div className="text-center py-6">
          <Stethoscope className="h-12 w-12 text-peach-300 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada dokter tersedia</p>
        </div>
      ) : (
        doctors.slice(0, 20).map((doctor) => (
          <div
            key={doctor.id}
            className="p-4 border border-peach-100 rounded-lg bg-gradient-to-r from-white to-peach-50/20 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-peach-100 rounded-full">
                <Stethoscope className="h-5 w-5 text-peach-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{doctor.name}</h4>
                <p className="text-sm text-gray-500">{doctor.email}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  <span className="text-xs text-green-600 font-medium">Tersedia</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </CardContent>
</Card>


            
          </div>
        </div>
      </main>

      {/* Mood Dialog */}
      <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
        <DialogContent className="bg-white border-purple-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-800 flex items-center">
              <Heart className="h-5 w-5 text-purple-600 mr-2" />
              Catat Mood Hari Ini
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Bagaimana perasaan Anda hari ini? Ceritakan mood Anda untuk tracking yang lebih baik.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMoodSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-gray-700 font-medium">Pilih Mood Anda</Label>
              <div className="grid grid-cols-5 gap-2">
                {moodEmojis.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                      selectedMood === mood.value 
                        ? 'border-purple-400 bg-purple-50 shadow-md transform scale-105' 
                        : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs text-gray-600 text-center leading-tight">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="moodNote" className="text-gray-700 font-medium">Catatan (Opsional)</Label>
              <Textarea
                id="moodNote"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                placeholder="Ceritakan apa yang membuat Anda merasa seperti ini..."
                className="border-purple-200 focus:border-purple-400 min-h-[80px] transition-colors"
              />
            </div>
            <Button 
              type="submit" 
              disabled={!selectedMood}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Heart className="h-4 w-4 mr-2" />
              Simpan Mood
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {selectedChat && (
        <ChatComponent consultationId={selectedChat} currentUserId={user.uid} onClose={() => setSelectedChat(null)} />
      )}
    </div>
  )
}

