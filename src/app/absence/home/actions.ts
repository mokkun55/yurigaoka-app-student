'use server'

import { HomecomingFormValues } from './page'

export async function submitHomecomingForm(data: HomecomingFormValues) {
  console.log('サーバーアクションで受け取ったデータ:', data)
}
