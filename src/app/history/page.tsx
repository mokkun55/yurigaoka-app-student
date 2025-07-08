import HomeHistoryCard from './_components/history-card/HomeHistoryCard'
import MealHistoryCard from './_components/history-card/MealHistoryCard'
import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/utils/supabase/database.types'

// ログイン中のユーザーの申請一覧を取得する
const fetchAbsences = async () => {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) {
    throw new Error('ユーザーが存在しません')
  }
  const { data, error } = await supabase.from('absences').select('*').eq('user_id', user.user.id)
  if (error) {
    throw error
  }
  return data
}

type Absence = Database['public']['Tables']['absences']['Row']

export default async function HistoryPage() {
  let absences: Absence[] = []
  let homes: { id: number; name: string }[] = []
  try {
    absences = await fetchAbsences()
    // home_id一覧を抽出
    const homeIds = Array.from(
      new Set(absences.map((a) => a.home_id).filter((id): id is number => typeof id === 'number'))
    )
    if (homeIds.length > 0) {
      const supabase = await createClient()
      const { data: homesData, error: homesError } = await supabase.from('homes').select('id, name').in('id', homeIds)
      if (homesError) throw homesError
      homes = homesData ?? []
    }
  } catch {
    return (
      <div>
        <div className="p-3 text-center">データの取得に失敗しました</div>
      </div>
    )
  }
  // home_id→nameのMap
  const homeIdToName = new Map(homes.map((h) => [h.id, h.name]))
  return (
    <div className="p-3 flex flex-col flex-grow overflow-y-auto">
      <p className="text-center text-sm">申請履歴をクリックで詳細を見ることができます</p>
      <div className="mt-3 flex flex-col gap-4 overflow-y-auto flex-grow">
        {absences.length === 0 ? (
          <div className="text-center text-(--sub-text)">申請履歴がありません</div>
        ) : (
          absences.map((absence) => {
            const status = (absence.status ?? 'pending') as 'pending' | 'approved' | 'rejected' | 'canceled'
            const mealDepartureBreakfast = absence.meal_departure_breakfast ?? false
            const mealDepartureDinner = absence.meal_departure_dinner ?? false
            const mealReturnBreakfast = absence.meal_return_breakfast ?? false
            const mealReturnDinner = absence.meal_return_dinner ?? false
            // home_idからplace取得
            const place = absence.home_id ? (homeIdToName.get(absence.home_id) ?? '') : ''
            if (absence.type === 'homecoming') {
              return (
                <HomeHistoryCard
                  key={absence.id}
                  status={status}
                  createdAt={absence.created_at}
                  period={{
                    startDate: absence.start_date ?? absence.created_at,
                    endDate: absence.end_date ?? absence.created_at,
                  }}
                  homecoming={{
                    id: String(absence.home_id ?? ''),
                    place,
                  }}
                  meal={{
                    startDate: { morning: mealDepartureBreakfast, evening: mealDepartureDinner },
                    endDate: { morning: mealReturnBreakfast, evening: mealReturnDinner },
                  }}
                />
              )
            } else {
              return (
                <MealHistoryCard
                  key={absence.id}
                  status={status}
                  createdAt={absence.created_at}
                  period={{
                    startDate: absence.start_date ?? absence.created_at,
                    endDate: absence.end_date ?? absence.created_at,
                  }}
                  meal={{
                    startDate: { morning: mealDepartureBreakfast, evening: mealDepartureDinner },
                    endDate: { morning: mealReturnBreakfast, evening: mealReturnDinner },
                  }}
                />
              )
            }
          })
        )}
      </div>
    </div>
  )
}
