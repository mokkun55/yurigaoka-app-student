'use server'

import type { UserFormValues, InvitationCodeValues } from './page'

export async function registerUser(data: UserFormValues) {
  console.log('サーバーで受け取ったユーザー情報:', data)
  // ここでDB登録などを行う
}

export async function verifyInvitationCode(data: InvitationCodeValues) {
  console.log('サーバーで受け取った招待コード:', data)
  // ここでDB登録などを行う
}
