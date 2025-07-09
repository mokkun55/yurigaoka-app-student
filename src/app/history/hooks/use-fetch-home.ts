// homeIdから家の情報を取得する

import { createClient } from '@/utils/supabase/server'

export const fetchHomeById = async (homeId: number) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('homes').select('*').eq('id', homeId).single()
  if (error) {
    throw error
  }
  return data
}
