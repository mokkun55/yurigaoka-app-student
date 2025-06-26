import { createClient } from '@/utils/supabase/server'

export default async function UserInfo() {
  const supabase = await createClient()
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) {
    throw new Error('ユーザーが見つかりません')
  }
  const { data: userData } = await supabase.from('users').select('*').eq('id', user?.user?.id).single()
  const { data: studentData } = await supabase.from('students').select('*').eq('id', user?.user?.id).single()
  return (
    <div>
      <p>メールアドレス: {user?.user?.email}</p>
      <p>ユーザーID: {user?.user?.id}</p>
      <br />
      <p>getUser</p>
      <pre className="text-xs h-40 overflow-y-auto">{JSON.stringify(user, null, 2)}</pre>

      <br />
      <p>usersテーブル</p>
      <pre className="text-xs h-40 overflow-y-auto">{JSON.stringify(userData, null, 2)}</pre>
      <br />
      <p>studentsテーブル</p>
      <pre className="text-xs h-40 overflow-y-auto">{JSON.stringify(studentData, null, 2)}</pre>
    </div>
  )
}
