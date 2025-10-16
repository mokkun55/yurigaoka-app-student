import { createClient } from '@/utils/supabase/server'

// ログイン中のユーザーの申請一覧を取得する
export const fetchAbsences = async () => {
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

// absenceIdから申請詳細を取得する
export const fetchAbsenceById = async (absenceId: number) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('absences').select('*').eq('id', absenceId).single()
  if (error) {
    throw error
  }
  return data
}
