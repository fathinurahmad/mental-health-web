// /app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong atau bukan string.' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key tidak ditemukan di environment.' }, { status: 500 })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528:free',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenRouter Error:', data)
      return NextResponse.json({ error: data.error?.message || 'Gagal memproses permintaan.' }, { status: response.status })
    }

    const reply = data.choices?.[0]?.message?.content || 'AI tidak memberikan balasan.'
    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Unhandled Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat menghubungi AI.' }, { status: 500 })
  }
}
