'use client'

import { createClient } from '@/utils/supabase/client'

// ログイン中のユーザーの帰省先一覧を取ってくる
const fetchHomeList = async () => {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    throw userError
  }
  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }
  const { data, error } = await supabase.from('homes').select('*').eq('user_id', userData.user.id)
  if (error) {
    throw error
  }
  return data
}

export default fetchHomeList
