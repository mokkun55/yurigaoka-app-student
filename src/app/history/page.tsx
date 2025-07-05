'use client'

import { useRouter } from 'next/navigation'
import Header from '@/_components/ui/header'
import Footer from '@/_components/ui/footer'

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div>
      <Header title="申請履歴" type="back" onClick={() => router.back()} />
      <div className="p-3">履歴</div>
      <Footer activeTab="history" />
    </div>
  )
}
