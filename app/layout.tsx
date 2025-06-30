import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FirebaseProvider } from "@/lib/contexts/firebase-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MindCare - Platform Kesehatan Mental",
  description: "Platform konsultasi kesehatan mental dengan dokter profesional",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  )
}
