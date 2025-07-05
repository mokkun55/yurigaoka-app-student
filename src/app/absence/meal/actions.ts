'use server'

import { MealFormValues } from './page'
import { createClient } from '@/utils/supabase/server'
import { TablesInsert } from '@/utils/supabase/database.types'

export async function submitMealForm(data: MealFormValues) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    throw new Error(userError.message)
  }
  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }

  const isOneDay = data.startDate === data.endDate

  const insertData: TablesInsert<'absences'> = {
    user_id: userData.user.id,
    start_date: data.startDate,
    end_date: data.endDate,
    reason: data.reason,
    meal_departure_breakfast: isOneDay ? data.breakfast : data.startBreakfast,
    meal_departure_dinner: isOneDay ? data.dinner : data.startDinner,
    meal_return_breakfast: isOneDay ? null : data.endBreakfast,
    meal_return_dinner: isOneDay ? null : data.endDinner,
    type: 'meal',
  }
  const { error: insertError } = await supabase.from('absences').insert([insertData])
  if (insertError) {
    throw new Error(insertError.message)
  }
  return true
}
