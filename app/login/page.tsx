'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/lib/contexts/firebase-context";
import { doc, getDoc } from "firebase/firestore";
import { Brain } from "lucide-react";
import FirebaseAuthComponent from "@/components/firebase-auth-component";
import Image from "next/image";

export default function LoginPage() {
  const { user, loading, db } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 Auth state:", { user, loading });

    if (!loading && user && db) {
      checkUserRole();
    }
  }, [user, loading, db]);

  const checkUserRole = async () => {
    if (!user || !db) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const { role } = userDoc.data() as { role?: string };
        console.log("✅ User role ditemukan:", role);

        if (role === "admin") {
          console.log("🔁 Redirect ke admin");
          router.push("/admin");
        } else if (role === "doctor") {
          console.log("🔁 Redirect ke doctor");
          router.push("/doctor");
        } else if (role === "patient") {
          console.log("🔁 Redirect ke patient");
          router.push("/patient");
        } else {
          console.warn("⚠️ Role tidak dikenal:", role);
          alert("Role tidak dikenal. Silakan hubungi admin.");
        }
      } else {
        console.warn("⚠️ Dokumen user tidak ditemukan di Firestore.");
        alert("Akun Anda belum terdaftar sepenuhnya. Silakan daftar ulang.");
      }
    } catch (err) {
      console.error("❌ Error saat mengecek role user:", err);
      alert("Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  if (loading || user) {
    const msg = loading ? "Loading..." : "Redirecting...";
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Brain className="h-8 w-8 animate-spin text-gray-500" />
        <p className="ml-2 text-gray-700">{msg}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* KIRI: Gambar dokter */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/doctor.png"
          alt="Doctor"
          fill
          className="object-cover"
        />
      </div>

      {/* KANAN: Form login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <FirebaseAuthComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
