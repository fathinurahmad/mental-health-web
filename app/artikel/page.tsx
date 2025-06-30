"use client"

import { useEffect, useState } from "react"
import { useFirebaseAuth } from "@/lib/contexts/firebase-context"
import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData
} from "firebase/firestore"
import {
  ArrowLeft,
  BookOpen,
  Play,
  Clock,
  User,
  Calendar,
  Tag
} from "lucide-react"

interface Article {
  id: string
  title: string
  excerpt: string
  content?: string
  username: string // Changed from authorName to username
  readTime: string
  category: string
  type: "artikel" | "video"
  createdAt?: string
}

export default function ArticlePage() {
  const { db } = useFirebaseAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  useEffect(() => {
    const fetchArticles = async () => {
      if (!db) return
      try {
        const q = query(collection(db, "articles"), orderBy("createdAt", "desc"))
        const snap = await getDocs(q)
        const result: Article[] = snap.docs.map((doc) => {
          const data = doc.data() as DocumentData
          return {
            id: doc.id,
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            username: data.username || data.authorName, // Fallback to authorName if username doesn't exist
            readTime: data.readTime,
            category: data.category,
            type: data.videoUrl ? "video" : "artikel",
            createdAt: data.createdAt?.seconds
              ? new Date(data.createdAt.seconds * 1000).toLocaleDateString()
              : "Tidak diketahui"
          }
        })
        setArticles(result)
      } catch (e) {
        console.error("Error fetching articles:", e)
      }
      setLoading(false)
    }
    fetchArticles()
  }, [db])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#111] mb-4">
            Artikel & Tips Kesehatan Mental
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Temukan wawasan dan tips praktis untuk menjaga kesehatan mental Anda
          </p>
        </div>

        {/* Back Button */}
        {selectedArticle && (
          <div className="mb-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="flex items-center gap-2 px-4 py-2 text-[#944D8A] hover:bg-[#944D8A] hover:text-white rounded-lg transition-all duration-200 border border-[#944D8A]"
            >
              <ArrowLeft size={18} />
              Kembali ke daftar
            </button>
          </div>
        )}

        {/* Article Content */}
        {selectedArticle ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Article Header */}
            <div className="bg-gradient-to-r from-[#944D8A] to-purple-600 text-white p-8">
              <div className="flex items-center gap-2 mb-4">
                {selectedArticle.type === "video" ? (
                  <Play size={20} className="bg-white/20 p-1 rounded" />
                ) : (
                  <BookOpen size={20} className="bg-white/20 p-1 rounded" />
                )}
                <span className="text-sm font-medium uppercase tracking-wide">
                  {selectedArticle.type}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {selectedArticle.title}
              </h1>
              
              {/* Article Meta */}
              <div className="flex flex-wrap gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>@{selectedArticle.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{selectedArticle.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{selectedArticle.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={16} />
                  <span>{selectedArticle.category}</span>
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="p-8">
              <div className="prose prose-lg max-w-none">
                {selectedArticle.content?.split("\n").map((para, i) => (
                  para.trim() && (
                    <p key={i} className="mb-6 text-gray-700 leading-relaxed text-justify">
                      {para}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin h-12 w-12 border-4 border-[#944D8A] border-t-transparent rounded-full mb-4"></div>
                <p className="text-gray-600">Memuat artikel...</p>
              </div>
            ) : articles.length > 0 ? (
              /* Articles Grid */
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group transform hover:-translate-y-1"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-[#944D8A]">
                          {article.type === "video" ? (
                            <Play size={18} className="bg-[#944D8A]/10 p-1 rounded" />
                          ) : (
                            <BookOpen size={18} className="bg-[#944D8A]/10 p-1 rounded" />
                          )}
                          <span className="text-sm font-semibold uppercase tracking-wide">
                            {article.type}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {article.category}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-[#111] mb-3 group-hover:text-[#944D8A] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          <span className="font-medium">@{article.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <Calendar size={12} />
                        <span className="text-xs text-gray-400">{article.createdAt}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Belum ada artikel
                </h3>
                <p className="text-gray-500">
                  Artikel dan tips kesehatan mental akan muncul di sini
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}