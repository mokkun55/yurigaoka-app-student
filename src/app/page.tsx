import Footer from '@/_components/ui/footer'
import Header from '@/_components/ui/header'
import { House, Utensils, History } from 'lucide-react'
import Link from 'next/link'
import ApplicationCard from '@/_components/ui/application-card'
import NoticeCard from '@/_components/ui/notice-card'
import { getCurrentUser } from '@/utils/supabase/getCurrentUser'

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <div>
      <Header title="ホーム" />

      <div className="p-4 gap-4 flex flex-col text-center">
        <div>
          <h1 className="text-2xl font-bold">こんにちは{user!.name}さん</h1>
          <p className="text-sm text-(--sub-text)">今日も一日頑張りましょう</p>
        </div>

        <div className="flex flex-col justify-center gap-2">
          <div className="flex gap-2 w-full">
            <ApplicationCard
              href="/absence/home"
              icons={[<House size={32} key="house" />, <Utensils size={32} key="utensils" />]}
              text="帰省・欠食届を出す"
            />
            <ApplicationCard
              href="/absence/meal"
              icons={[<Utensils size={32} key="utensils" />]}
              text="欠食届のみを出す"
            />
          </div>
          <Link
            href="/history"
            className="bg-white text-base font-bold flex items-center gap-2 text-center justify-center border border-(--border-gray) rounded-md p-2 cursor-pointer"
          >
            <History size={24} color="var(--main-blue)" />
            申請履歴を見る
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-base font-bold">お知らせ</h1>

          <div>
            <NoticeCard
              title="[重要] 夏期帰省の申請期限について"
              description="夏季休暇中の帰省届は7月15日までです。忘れずに提出してください"
              date="2025/07/03"
            />
          </div>
        </div>
      </div>

      <Footer activeTab="home" />
    </div>
  )
}
