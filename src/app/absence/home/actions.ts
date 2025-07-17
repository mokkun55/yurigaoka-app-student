'use server'

import { HomecomingFormValues } from './page'
import { createClient } from '@/utils/supabase/server'
import { TablesInsert } from '@/utils/supabase/database.types'
import dayjs from 'dayjs'

export async function submitHomecomingForm(data: HomecomingFormValues) {
  console.log('サーバーアクションで受け取ったデータ:', data)
  const supabase = await createClient()
  // ユーザーID取得
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    throw new Error(userError.message)
  }
  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }

  // destination（帰省先）はJSON文字列またはオブジェクトなので型ガード
  let destinationObj: { name: string; address: string }
  if (typeof data.destination === 'string') {
    destinationObj = JSON.parse(data.destination)
  } else {
    destinationObj = data.destination
  }
  // homesテーブルから該当home_idを取得
  const { data: home, error: homeError } = await supabase
    .from('homes')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('name', destinationObj.name)
    .eq('address', destinationObj.address)
    .single()
  if (!home || homeError) {
    throw new Error('帰省先が見つかりません')
  }

  // start_date, end_date を日付＋時刻で結合（dayjsでフォーマット）
  const startDateTime = dayjs(`${data.startDate}T${data.departureTime}`).format('YYYY-MM-DDTHH:mm')
  const endDateTime = dayjs(`${data.endDate}T${data.returnTime}`).format('YYYY-MM-DDTHH:mm')

  // absencesテーブルにinsert
  const insertData: TablesInsert<'absences'> = {
    user_id: userData.user.id,
    start_date: startDateTime,
    end_date: endDateTime,
    home_id: home.id,
    reason: data.reason,
    start_meal: data.meal_start ?? null,
    end_meal: data.meal_end ?? null,
    special_reason: data.specialReason ?? null,
    type: 'homecoming',
  }
  const { error: insertError } = await supabase.from('absences').insert(insertData)
  if (insertError) {
    throw new Error(insertError.message)
  }
  return true
}
