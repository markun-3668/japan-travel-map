import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nippon Loop | 日本一周マップ',
  description: '日本全国の訪問地を地図で記録する日本一周管理アプリ',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
