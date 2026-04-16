import OpenAI from 'openai'
import { NextResponse } from 'next/server'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatRequestBody = {
  messages?: ChatMessage[]
}

const SYSTEM_PROMPT =
  'You are a crypto and wealth management assistant. Help users understand crypto markets, prices, and investment strategies. Be concise and professional.'

function getXaiClient() {
  return new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: 'https://api.x.ai/v1',
  })
}

export async function POST(req: Request) {
  try {
    if (!process.env.XAI_API_KEY) {
      throw new Error('XAI_API_KEY is not configured')
    }

    const client = getXaiClient()
    const body = (await req.json()) as ChatRequestBody
    const messages = Array.isArray(body.messages) ? body.messages : []

    const completion = await client.chat.completions.create({
      model: 'grok-3-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    })

    const reply = completion.choices[0]?.message?.content ?? ''
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    )
  }
}
