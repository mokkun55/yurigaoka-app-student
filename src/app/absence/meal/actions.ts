'use server'

import { MealFormValues } from './page'
import { createClient } from '@/utils/supabase/server'
import { TablesInsert } from '@/utils/supabase/database.types'

export async function submitMealForm(data: MealFormValues) {
  // console.log('submitMealForm data:', data)
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    throw new Error(userError.message)
  }
  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }

  // 1日のみの欠食の場合、oneDayBreakfast/oneDayDinnerからstart_meal/end_mealを決定
  let start_meal = data.start_meal ?? null
  let end_meal = data.end_meal ?? null
  if (data.startDate === data.endDate) {
    if (data.oneDayBreakfast && data.oneDayDinner) {
      start_meal = 'breakfast'
      end_meal = 'dinner'
    } else if (data.oneDayBreakfast) {
      start_meal = 'breakfast'
      end_meal = 'breakfast'
    } else if (data.oneDayDinner) {
      start_meal = 'dinner'
      end_meal = 'dinner'
    } else {
      // どちらも欠食しない（バリデーションで弾かれるはず）
      start_meal = null
      end_meal = null
    }
  }

  const insertData: TablesInsert<'absences'> = {
    user_id: userData.user.id,
    start_date: data.startDate,
    end_date: data.endDate,
    reason: data.reason,
    type: 'meal',
    start_meal: start_meal,
    end_meal: end_meal,
  }
  const { error: insertError } = await supabase.from('absences').insert([insertData])
  if (insertError) {
    throw new Error(insertError.message)
  }
  return true
}
