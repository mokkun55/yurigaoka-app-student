'use client'

import { useRouter } from 'next/navigation'
import Header from '@/_components/ui/header'
import Footer from '@/_components/ui/footer'
import HistoryCard from './_components/history-card'

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div>
      <Header title="申請履歴" type="back" onClick={() => router.back()} />
      <div className="p-3">
        <p className="text-center text-sm">申請履歴をクリックで詳細を見ることができます</p>
        <div className="mt-3 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {Array.from({ length: 10 }).map((_, index) => (
            <HistoryCard
              key={index}
              status={index % 2 === 0 ? 'pending' : 'approved'}
              type={index % 2 === 0 ? 'homecoming' : 'meal'}
              createdAt="2025/01/01"
              homecoming={{
                id: '1',
                place: '実家',
              }}
              period={{
                startDate: new Date('2025/01/01 12:00'),
                endDate: new Date('2025/01/01 14:00'),
              }}
              meal={{
                startDate: { morning: false, evening: true },
                endDate: { morning: false, evening: true },
              }}
            />
          ))}
        </div>
      </div>
      <Footer activeTab="history" />
    </div>
  )
}
