'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Brain, Shield, Users, Heart, ArrowRight, Menu, X } from "lucide-react"

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
              <span className="ml-2 text-2xl font-bold text-gray-900">MindCase</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-[#924B88] transition-colors">
                Fitur
              </a>
              <a href="#about" className="text-gray-700 hover:text-[#924B88] transition-colors">
                Tentang
              </a>
              <a href="#contact" className="text-gray-700 hover:text-[#924B88] transition-colors">
                Kontak
              </a>
              <button
                onClick={navigateToLogin}
                className="bg-[#924B88] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center"
              >
                Masuk
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-[#924B88]"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-[#924B88]">
                Fitur
              </a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-[#924B88]">
                Tentang
              </a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-[#924B88]">
                Kontak
              </a>
              <button
                onClick={navigateToLogin}
                className="w-full text-left px-3 py-2 text-[#924B88] font-medium"
              >
                Masuk
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Brain className="h-16 w-16 text-[#924B88] mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Selamat Datang di <span className="text-[#924B88]">MindCase</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform kesehatan mental komprehensif yang menghubungkan pasien, dokter, dan admin
              untuk layanan kesehatan mental yang lebih baik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={navigateToLogin}
                className="bg-[#924B88] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-colors flex items-center justify-center"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-[#924B88] text-[#924B88] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#924B88]/10 transition-colors">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih MindCase?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platform kami menyediakan alat komprehensif untuk manajemen kesehatan mental
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-[#924B88]/20 hover:bg-[#924B88]/30 transition-colors">
              <Users className="h-12 w-12 text-[#924B88] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Untuk Pasien</h3>
              <p className="text-gray-600">
                Lacak perjalanan kesehatan mental Anda, buat janji temu, dan terhubung dengan profesional berkualitas.
              </p>
            </div>
            <div className="text-center p-8 rounded-lg bg-[#924B88]/20 hover:bg-[#924B88]/30 transition-colors">
              <Heart className="h-12 w-12 text-[#924B88] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Untuk Dokter</h3>
              <p className="text-gray-600">
                Kelola rekam medis pasien, jadwalkan janji, dan berikan perawatan dengan mudah.
              </p>
            </div>
            <div className="text-center p-8 rounded-lg bg-[#924B88]/20 hover:bg-[#924B88]/30 transition-colors">
              <Shield className="h-12 w-12 text-[#924B88] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Untuk Admin</h3>
              <p className="text-gray-600">
                Awasi operasi platform, kelola pengguna, dan pastikan layanan berjalan lancar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tentang MindCase
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              MindCase berdedikasi untuk membuat layanan kesehatan mental dapat diakses, efisien, dan komprehensif.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Misi Kami</h3>
              <p className="text-gray-600 mb-6">
                Merevolusi layanan kesehatan mental dengan menghubungkan semua pemangku kepentingan dalam ekosistem,
                memastikan setiap orang mendapat perawatan yang layak.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#924B88] rounded-full mr-3"></div>
                  Manajemen data pasien yang aman
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#924B88] rounded-full mr-3"></div>
                  Penjadwalan janji temu yang mudah
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#924B88] rounded-full mr-3"></div>
                  Pelaporan dan analitik lengkap
                </li>
              </ul>
            </div>
            <div className="bg-[#924B88]/20 rounded-lg p-8 text-center">
              <Brain className="h-24 w-24 text-[#924B88] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kesehatan Mental Itu Penting</h3>
              <p className="text-gray-600">
                Bergabunglah dengan ribuan pengguna yang mempercayai MindCase untuk perjalanan mereka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#924B88]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Siap untuk Memulai?
          </h2>
          <p className="text-xl text-[#fff]/80 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan MindCase hari ini dan ambil langkah pertama menuju manajemen kesehatan mental yang lebih baik.
          </p>
          <button
            onClick={navigateToLogin}
            className="bg-white text-[#924B88] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Mulai Perjalanan Anda
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-[#924B88]" />
                <span className="ml-2 text-2xl font-bold">MindCase</span>
              </div>
              <p className="text-gray-400 mb-4">
                Platform kesehatan mental komprehensif untuk manajemen layanan yang lebih baik.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Fitur</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Tentang</a></li>
                <li><button onClick={navigateToLogin} className="hover:text-white transition-colors">Masuk</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@mindcase.com</li>
                <li>Telepon: +62 123 456 789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MindCase. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
