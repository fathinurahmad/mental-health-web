'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Brain, Shield, Users, Heart, ArrowRight, Menu, X, MessageCircleHeart, Smile, Smartphone } from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const navigateToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#924B88]">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-[#924B88]" />
              <span className="ml-2 text-2xl font-bold text-gray-900">MindCare</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#924B88]">Fitur</a>
              <a href="#about" className="text-gray-700 hover:text-[#924B88]">Tentang</a>
              <a href="#contact" className="text-gray-700 hover:text-[#924B88]">Kontak</a>
              <button
                onClick={navigateToLogin}
                className="bg-[#924B88] text-white px-6 py-2 rounded-lg hover:opacity-90 flex items-center"
              >
                Masuk <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-[#924B88]">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-3 space-y-2">
            <a href="#features" className="block text-gray-700 hover:text-[#924B88]">Fitur</a>
            <a href="#about" className="block text-gray-700 hover:text-[#924B88]">Tentang</a>
            <a href="#contact" className="block text-gray-700 hover:text-[#924B88]">Kontak</a>
            <button
              onClick={navigateToLogin}
              className="w-full text-left text-[#924B88] font-medium"
            >
              Masuk
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Selamat Datang di <span className="text-[#924B88]">MindCare</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Temukan kenyamanan dalam merawat kesehatan mentalmu. Konsultasi mudah, cepat, dan aman.
            </p>
            <button
              onClick={navigateToLogin}
              className="bg-[#924B88] text-white px-6 py-3 rounded-lg hover:opacity-90 inline-flex items-center"
            >
              Mulai Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {/* Gambar Hero */}
          <div className="w-full h-64 sm:h-80 md:h-[400px] relative">
            <Image
              src="/images/image.png"
              alt="Ilustrasi MindCare"
              fill
              priority
              className="object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Gambar Ilustrasi Tambahan */}
<section className="py-12 px-4 bg-white">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
    {/* Gambar */}
    <div className="relative w-full h-64 sm:h-80 md:h-96">
      <Image
        src="/images/image1.jpg"
        alt="Ilustrasi tambahan MindCare"
        fill
        className="object-contain rounded-xl shadow-md"
      />
    </div>

    {/* Teks Deskripsi */}
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Kegiatan Bersama MindCare</h3>
      <p className="text-gray-600 text-lg leading-relaxed">
        Kami percaya bahwa perjalanan menuju kesehatan mental yang lebih baik dimulai dengan langkah kecil yang penuh makna. 
        Ilustrasi ini menggambarkan sesi konsultasi antara pasien dan profesional secara daring, dengan suasana yang hangat dan suportif.
      </p>
      <p className="text-gray-600 mt-4">
        MindCare menyediakan berbagai fitur interaktif seperti pelacakan mood harian, journaling pribadi, dan komunitas pendukung yang ramah. 
        Semua dirancang untuk memastikan pengguna merasa aman dan dihargai.
      </p>
    </div>
  </div>
</section>


     {/* Features */}
<section id="features" className="py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl font-bold text-gray-900">Fitur Unggulan MindCare</h2>
      <p className="text-lg text-gray-600 mt-2">
        Kami hadir untuk mendukung setiap langkahmu menuju kesehatan mental yang lebih baik
      </p>
    </div>

    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
      <div className="text-center bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <Users className="mx-auto mb-4 h-10 w-10 text-[#924B88]" />
        <h3 className="font-semibold text-lg mb-2">Mood Tracking</h3>
        <p className="text-gray-600">
          Catat dan pantau suasana hatimu setiap hari untuk pemahaman diri yang lebih baik.
        </p>
      </div>

      <div className="text-center bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <Heart className="mx-auto mb-4 h-10 w-10 text-[#924B88]" />
        <h3 className="font-semibold text-lg mb-2">Konsultasi Dokter</h3>
        <p className="text-gray-600">
          Terhubung dengan psikolog berlisensi dan atur jadwal konsultasi dengan mudah.
        </p>
      </div>

      <div className="text-center bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <Shield className="mx-auto mb-4 h-10 w-10 text-[#924B88]" />
        <h3 className="font-semibold text-lg mb-2">Baca Artikel</h3>
        <p className="text-gray-600">
          Jelajahi artikel bermanfaat tentang kesehatan mental, tips, dan kisah inspiratif.
        </p>
      </div>

      <div className="text-center bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <Brain className="mx-auto mb-4 h-10 w-10 text-[#924B88]" />
        <h3 className="font-semibold text-lg mb-2">Konsultasi AI</h3>
        <p className="text-gray-600">
          Dapatkan dukungan awal dari AI kami yang siap mendengarkan kapan pun kamu butuh.
        </p>
      </div>

      <div className="text-center bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <Heart className="mx-auto mb-4 h-10 w-10 text-[#924B88]" />
        <h3 className="font-semibold text-lg mb-2">Motivasi Harian</h3>
        <p className="text-gray-600">
          Dapatkan kutipan motivasi setiap hari untuk menjaga semangatmu tetap menyala.
        </p>
      </div>

      <div className="text-center bg-white p-6 rounded-lg shadow hover:shadow-md transition">
        <Shield className="mx-auto mb-4 h-10 w-10 text-[#924B88]" />
        <h3 className="font-semibold text-lg mb-2">Keamanan Data</h3>
        <p className="text-gray-600">
          Semua informasi pribadi terlindungi dengan sistem keamanan dan enkripsi tingkat tinggi.
        </p>
      </div>
    </div>
  </div>
</section>


     {/* Value Section */}
<section className="py-20 bg-[#fdf5fd]">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-[#924B88] mb-6">
      Kami Percaya Kesehatan Mental adalah Hak Semua Orang
    </h2>
    <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
      Di MindCare, kami berkomitmen memberikan layanan terbaik yang ramah, aman, dan mudah dijangkau.
      Setiap fitur kami dirancang untuk benar-benar memahami dan membantu kebutuhan mentalmu.
    </p>

    <div className="grid md:grid-cols-3 gap-8">
      {/* Dukungan Berkelanjutan */}
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <MessageCircleHeart className="h-12 w-12 text-[#924B88] mb-4" />
        <h4 className="font-semibold text-xl mb-2">Dukungan Berkelanjutan</h4>
        <p className="text-gray-600 text-center">
          Kami menyediakan sumber daya dan komunitas yang selalu siap mendukungmu kapan saja, di mana saja.
        </p>
      </div>

      {/* Pendekatan Personal */}
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <Smile className="h-12 w-12 text-[#924B88] mb-4" />
        <h4 className="font-semibold text-xl mb-2">Pendekatan Personal</h4>
        <p className="text-gray-600 text-center">
          Pengalaman yang dirancang khusus mengikuti ritme hidupmu dan kebutuhan emosionalmu secara personal.
        </p>
      </div>

      {/* Aksesibilitas Mudah */}
      <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <Smartphone className="h-12 w-12 text-[#924B88] mb-4" />
        <h4 className="font-semibold text-xl mb-2">Aksesibilitas Mudah</h4>
        <p className="text-gray-600 text-center">
          Tersedia di berbagai perangkat dan bebas hambatan, sehingga siapa pun bisa mendapatkan bantuan dengan cepat.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <Brain className="h-6 w-6 text-[#924B88]" />
              <span className="ml-2 text-xl font-bold">MindCare</span>
            </div>
            <p className="text-gray-400">
              Platform digital untuk mendukung kesehatan mental secara menyeluruh dan ramah pengguna.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Tautan Cepat</h3>
            <ul className="text-gray-400 space-y-2">
              <li><a href="#features" className="hover:text-white">Fitur</a></li>
              <li><a href="#about" className="hover:text-white">Tentang</a></li>
              <li><button onClick={navigateToLogin} className="hover:text-white">Masuk</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Kontak</h3>
            <ul className="text-gray-400 space-y-2">
              <li>Email: support@mindcare.com</li>
              <li>Telepon: +62 123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-10 border-t border-gray-800 pt-6">
          &copy; 2025 MindCare. Semua hak dilindungi.
        </div>
      </footer>
    </div>
  )
}
