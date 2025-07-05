'use client'

import Header from '@/_components/ui/header'
import Footer from '@/_components/ui/footer'
import { useRouter } from 'next/navigation'
import { Button } from '@/_components/ui/button'

export default function Setting() {
  const router = useRouter()
  return (
    <div>
      <Header title="設定" type="back" onClick={() => router.back()} />
      <div className="p-3">
        {/* TODO 現在は仮置き */}
        <h1>設定</h1>
        <Button onClick={() => router.push('/develop')}>開発者用ページへ</Button>
      </div>
      <Footer activeTab="setting" />
    </div>
  )
}
