import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/src/lib/supabase/server'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

type ChatRequestBody = {
  messages?: ChatMessage[]
}

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
})

const SYSTEM_PROMPT =
  'You are a crypto and wealth management assistant. Help users understand crypto markets, prices, and investment strategies. Be concise and professional.'

async function isAuthenticatedRequest(req: Request): Promise<boolean> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false

  const [scheme, token] = authHeader.split(' ')
  if (scheme.toLowerCase() !== 'bearer' || !token?.trim()) {
    return false
  }

  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser(token.trim())

  if (error) {
    return false
  }

  return Boolean(data.user)
}

export async function POST(req: Request) {
  try {
    if (!(await isAuthenticatedRequest(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.XAI_API_KEY) {
      throw new Error('XAI_API_KEY is not configured')
    }

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
