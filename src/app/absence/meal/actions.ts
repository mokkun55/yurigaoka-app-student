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

  const insertData: TablesInsert<'absences'> = {
    user_id: userData.user.id,
    start_date: data.startDate,
    end_date: data.endDate,
    reason: data.reason,
    type: 'meal',
    start_meal: data.start_meal ?? null,
    end_meal: data.end_meal ?? null,
  }
  const { error: insertError } = await supabase.from('absences').insert([insertData])
  if (insertError) {
    throw new Error(insertError.message)
  }
  return true
}
