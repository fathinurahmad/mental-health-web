"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, RotateCcw } from 'lucide-react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  timestamp: string
  isError?: boolean
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Halo! Saya siap membantu Anda. Silakan ajukan pertanyaan atau ceritakan apa yang ingin Anda konsultasikan.",
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputMessage])

  const callAIAPI = async (message: string): Promise<string> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.reply ?? "Maaf, tidak ada balasan dari AI."
  }

  const sendMessage = async () => {
    const trimmedMessage = inputMessage.trim()
    if (!trimmedMessage || isLoading) return

    const userMessage: Message = {
      id: Date.now(),
      text: trimmedMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const aiReply = await callAIAPI(trimmedMessage)
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: aiReply,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Halo! Saya siap membantu Anda. Silakan ajukan pertanyaan atau ceritakan apa yang ingin Anda konsultasikan.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ])
  }

  const LoadingDots = () => (
    <div className="flex space-x-1 items-center">
      <div className="w-2 h-2 bg-[#944D8A] rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-[#944D8A] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-[#944D8A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <span className="ml-2 text-sm text-gray-500">AI sedang mengetik...</span>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#944D8A] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">AI Assistant</h1>
              <p className="text-sm text-gray-500">{isLoading ? 'Sedang mengetik...' : 'Online'}</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                msg.sender === 'user'
                  ? 'bg-[#944D8A]'
                  : msg.isError
                  ? 'bg-red-500'
                  : 'bg-[#944D8A]'
              }`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-xs lg:max-w-2xl ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`px-4 py-2 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[#944D8A] text-white'
                    : msg.isError
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                <p className="text-xs mt-1 text-gray-400">{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[#944D8A] rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan Anda di sini..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#944D8A] resize-none overflow-hidden"
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={isLoading}
                rows={1}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="w-12 h-12 bg-[#944D8A] text-white rounded-full flex items-center justify-center hover:bg-[#7a3d72] transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => setInputMessage("Halo, saya membutuhkan bantuan...")} className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full">Minta Bantuan</button>
            <button onClick={() => setInputMessage("Bisakah Anda menjelaskan tentang...")} className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full">Minta Penjelasan</button>
            <button onClick={() => setInputMessage("Saya ingin berkonsultasi tentang...")} className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full">Konsultasi</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
