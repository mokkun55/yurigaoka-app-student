import { createClient } from '@/utils/supabase/server'

// プリセット名から帰省先を取得する
const useFetchHomeByPresetName = async (presetName: string) => {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) {
    throw userError
  }
  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }

  const { data, error } = await supabase
    .from('homes')
    .select('*')
    .eq('name', presetName)
    .eq('user_id', userData.user.id)
    .single()
  if (error) {
    throw error
  }
  return data
}

export default useFetchHomeByPresetName
