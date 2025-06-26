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
    const { data: user, error: userUpdateError } = await supabase
      .from('users')
      .update({
        name: registerFormData.name, // これはformから取得したユーザー名
        role: 'student',
        is_deleted: false,
      })
      .eq('id', userData.user.id) // idはDBから取得してきたuserId
      .select()
      .single()
    if (userUpdateError) {
      throw new Error(userUpdateError.message)
    }

    // 学年の取得
    const fetchGradeIdByGradeName = async (gradeName: string) => {
      const { data: grade, error: gradeError } = await supabase
        .from('grades')
        .select('id')
        .eq('name', gradeName)
        .single()
      if (gradeError) {
        throw new Error(gradeError.message)
      }
      return grade.id
    }

    // クラスの取得
    const fetchClassIdByClassName = async (className: string) => {
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('name', className)
        .single()
      if (classesError) {
        throw new Error(classesError.message)
      }
      return classes.id
    }

    // クラブの取得
    const fetchClubIdByClubName = async (clubName: string) => {
      const { data: club, error: clubError } = await supabase.from('clubs').select('id').eq('name', clubName).single()
      if (clubError) {
        throw new Error(clubError.message)
      }
      return club.id
    }

    if (!registerFormData.gradeName || !registerFormData.className) {
      throw new Error('学年またはクラスが未入力です')
    }

    // 学年 クラス クラブの取得
    const fetchGradeId = await fetchGradeIdByGradeName(registerFormData.gradeName)
    const fetchClassId = await fetchClassIdByClassName(registerFormData.className)
    const fetchClubId =
      registerFormData.club && registerFormData.club !== 'none'
        ? await fetchClubIdByClubName(registerFormData.club)
        : null

    // studentsテーブルにデータを追加(更新)
    const { data: student, error: studentError } = await supabase
      .from('students')
      .update({
        grade_id: fetchGradeId,
        class_id: fetchClassId,
        club_id: fetchClubId,
        is_leader: false,
        room_number: Number(registerFormData.roomNumber),
        parent_name: registerFormData.parentName,
        phone_number: Number(registerFormData.emergencyTel),
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

  // 帰省先の登録
  const { data: home, error: homeError } = await supabase
    .from('homes')
    .insert({
      user_id: userData.user.id,
      name: registerFormData.homeAddressName,
      address: registerFormData.homeAddressAddress,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()
  if (homeError) {
    throw new Error(homeError.message)
  }
  console.log('home', home)
}

export async function verifyInvitationCode(data: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', data)
  // ここでDB登録などを行う
}
