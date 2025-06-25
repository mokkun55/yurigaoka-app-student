'use server'

import type { UserFormValues, InvitationCodeValues } from './page'
import { createClient } from '@/utils/supabase/server'

export async function registerUser(registerFormData: UserFormValues) {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (!userData.user) {
    throw new Error('ユーザーが見つかりません')
  }

  if (userError) {
    throw new Error(userError.message)
  }

  console.log('サーバーで受け取ったユーザー情報:', registerFormData)
  // ここでDB登録などを行う
  try {
    // ユーザー情報をupdate
    // MEMO: ユーザー情報はユーザー登録時に作成されるため、upsertではなくupdateを使用する
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({
        name: registerFormData.name, // これはformから取得したユーザー名
        role: 'student',
        is_deleted: false,
      })
      .eq('id', userData.user.id) // idはDBから取得してきたuserId
      .select()
      .single()
    if (userError) {
      throw new Error(userError.message)
    }

    // studentsテーブルにデータを追加(更新)
    const { data: student, error: studentError } = await supabase
      .from('students')
      .update({
        // TODO
        grade_id: 1,
        class_id: 1,
        // TODO あとで追加
        // まずは name から idを取得しないといけない かも...?
        // てかまずnullも許容
        // club_id: 0,
        is_leader: false,
      })
      .eq('id', userData.user.id)
      .select()
      .single()
    console.log('student', student)
    if (studentError) {
      throw new Error(studentError.message)
    }

    console.log('ユーザー情報:', user)
  } catch (error) {
    console.error('ユーザー登録エラー:', error)
    throw error
  }
}

export async function verifyInvitationCode(data: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', data)
  // ここでDB登録などを行う
}
