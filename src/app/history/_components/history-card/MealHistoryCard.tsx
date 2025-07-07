import { ForkKnife } from 'lucide-react'
import Badge from '../badge'
import dayjs from 'dayjs'

type Props = {
  status: 'pending' | 'approved' | 'rejected' | 'canceled'
  createdAt: string
  period: {
    startDate: Date
    endDate: Date
  }
  meal: {
    startDate: {
      morning: boolean
      evening: boolean
    }
    endDate: {
      morning: boolean
      evening: boolean
    }
  }
}

export default function MealHistoryCard({ status, createdAt, period, meal }: Props) {
  let borderColor = ''
  switch (status) {
    case 'pending':
      borderColor = 'border-(--yellow)'
      break
    case 'approved':
      borderColor = 'border-(--green)'
      break
    case 'rejected':
      borderColor = 'border-(--red)'
      break
    case 'canceled':
      borderColor = 'border-(--gray)'
      break
  }

  return (
    <div className={`bg-white rounded-lg p-4 flex flex-col gap-2 border-l-4 ${borderColor}`}>
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        {/* 左 */}
        <div className="flex items-center gap-2 text-(--sub-text)">
          <div className="flex items-center gap-1">
            <ForkKnife width={16} height={16} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm">申請日: {createdAt}</p>
          </div>
        </div>
        {/* 右 */}
        <div className="flex items-center gap-2">
          <Badge type={status} size="small" />
        </div>
      </div>
      {/* メイン */}
      <div className="flex flex-col gap-2">
        <p className="text-base font-bold">欠食届</p>
        <div className="flex flex-col text-(--sub-text)">
          <p>
            欠食期間: {dayjs(period.startDate).format('YYYY/MM/DD')} {meal.startDate.morning && '朝食'}
            {meal.startDate.evening && '夕食'}
            <span className="mx-1">~</span>
            {dayjs(period.endDate).format('YYYY/MM/DD')} {meal.endDate.morning && '朝食'}
            {meal.endDate.evening && '夕食'}
          </p>
        </div>
      </div>
    </div>
  )
}
