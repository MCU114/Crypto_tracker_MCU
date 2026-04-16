'use client'

import { FormEvent, KeyboardEvent, useEffect, useState } from 'react'

type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  role: ChatRole
  content: string
}

type ChatApiResponse = {
  reply: string
}

export default function ChatBot() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const hasSessionCookie = document.cookie
      .split(';')
      .some((cookie) => cookie.trim().startsWith('cryptopedia_session='))

    setIsAuthenticated(hasSessionCookie)
  }, [])

  if (isAuthenticated !== true) {
    return null
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMessage]

    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch assistant response')
      }

      const data = (await response.json()) as ChatApiResponse
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply || 'Sorry, I could not generate a response.',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat UI error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      void sendMessage()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div
            className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: '#2157b2' }}
          >
            <span>Crypto Assistant</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-lg leading-none text-white"
              aria-label="Close chatbot"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {messages.length === 0 && (
              <p className="text-sm text-slate-500">
                Ask about crypto markets, prices, or strategy.
              </p>
            )}

            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'ml-auto bg-blue-600 text-white'
                    : 'mr-auto bg-slate-200 text-slate-800'
                }`}
              >
                {message.content}
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto max-w-[85%] rounded-lg bg-slate-200 px-3 py-2 text-sm text-slate-800">
                Thinking...
              </div>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message..."
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: '#2157b2' }}
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg"
        style={{ backgroundColor: '#2157b2' }}
      >
        {isOpen ? 'Close Chat' : 'Chat'}
      </button>
    </div>
  )
}
