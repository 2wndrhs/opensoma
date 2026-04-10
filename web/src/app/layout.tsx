import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'SW마에스트로',
  description: 'SWMaestro MyPage',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <div className="isolate min-h-screen">{children}</div>
      </body>
    </html>
  )
}
