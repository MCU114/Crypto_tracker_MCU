import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/src/components/common/ClientProviders'
import ChatBot from '@/src/components/common/ChatBot'

export const metadata: Metadata = {
  title: 'Cryptopedia - Crypto Research Hub for Hong Kong Traders',
  description: 'Compare crypto exchanges, wallets, track assets, read guides, and stay updated with regulatory news for Hong Kong traders.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <ClientProviders>
          {children}
          <ChatBot />
        </ClientProviders>
      </body>
    </html>
  )
}


