'use server'

import { MealFormValues } from './page'
import { createClient } from '@/utils/supabase/server'
import { TablesInsert } from '@/utils/supabase/database.types'

export async function submitMealForm(data: MealFormValues) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }
  if (userError) {
    throw new Error(userError.message)
  }

  const insertData: TablesInsert<'absences'> = {
    user_id: userData.user.id,
    start_date: data.startDate,
    end_date: data.endDate,
    reason: data.reason,
    meal_departure_breakfast: data.startBreakfast ?? null,
    meal_departure_dinner: data.startDinner ?? null,
    meal_return_breakfast: data.endBreakfast ?? null,
    meal_return_dinner: data.endDinner ?? null,
    type: 'meal',
  }
  const { error: insertError } = await supabase.from('absences').insert([insertData])
  if (insertError) {
    throw new Error(insertError.message)
  }
  return true
}
