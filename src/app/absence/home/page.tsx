'use client'

import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/_components/ui/header'
import InputLabel from '@/_components/ui/input-label'
import { BaseSelect } from '@/_components/ui/input/base-select'
import { Button } from '@/_components/ui/button'
import { CheckboxField } from '@/_components/ui/checkbox/checkbox-field'
import { useState, useEffect } from 'react'
import { DateInput } from '@/_components/ui/input/date-input'
import { TimeInput } from '@/_components/ui/input/time-input'
import { submitHomecomingForm } from './actions'
import fetchHomeList from '../hooks/use-fetch-home-list'
import { Database } from '@/utils/supabase/database.types'
import LoadingSpinner from '@/_components/ui/loading-spinner'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

// TODO 平日は帰らせないなどの仕組みも追加する

// 門限時刻を変数で定義
const LIMIT_MORNING = '07:39'
const LIMIT_NIGHT = '20:29'

// 分単位で時刻比較する関数
const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

// 特別な事情が必要かどうか判定する共通関数
const isSpecialReasonRequired = (dep?: string, ret?: string) => {
  // 出発が朝より早い、または夜より遅い
  const depEarly = dep && toMinutes(dep) < toMinutes(LIMIT_MORNING)
  const depLate = dep && toMinutes(dep) >= toMinutes(LIMIT_NIGHT)
  // 帰寮が夜より遅い、または朝より早い
  const retLate = ret && toMinutes(ret) > toMinutes(LIMIT_NIGHT)
  const retEarly = ret && toMinutes(ret) <= toMinutes(LIMIT_MORNING)
  return !!(depEarly || depLate || retEarly || retLate)
}

const homecomingFormSchema = z
  .object({
    startDate: z.string().min(1, '開始日を選択してください'),
    endDate: z.string().min(1, '終了日を選択してください'),
    departureTime: z.string().min(1, '出発予定時刻を入力してください'),
    returnTime: z.string().min(1, '帰寮予定時刻を入力してください'),
    destination: z.string().min(1, '帰省先を選択してください'),
    reason: z.string().min(1, '理由を入力してください'),
    mealDepartureBreakfast: z.boolean().optional(),
    mealDepartureDinner: z.boolean().optional(),
    mealReturnBreakfast: z.boolean().optional(),
    mealReturnDinner: z.boolean().optional(),
    specialReason: z.string().optional(),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: '開始日は終了日より前の日付を選択してください',
    path: ['startDate'],
  })
  .refine((data) => data.startDate !== data.endDate, {
    message: '開始日と終了日が同じ日付になっています',
    path: ['endDate'],
  })
  .refine(
    (data) => {
      const today = new Date()
      const start = new Date(data.startDate)
      today.setHours(0, 0, 0, 0)
      const threeDaysLater = new Date(today)
      threeDaysLater.setDate(today.getDate() + 3)
      return start >= threeDaysLater
    },
    { message: '帰省届は3日前までに提出してください', path: ['startDate'] }
  )
  .refine(
    (data) => {
      if (isSpecialReasonRequired(data.departureTime, data.returnTime)) {
        return data.specialReason && data.specialReason.trim().length > 0
      }
      return true
    },
    {
      message: '特別な事情を入力してください',
      path: ['specialReason'],
    }
  )

export type HomecomingFormValues = z.infer<typeof homecomingFormSchema>

export default function AbsenceHome() {
  const router = useRouter()
  const [homes, setHomes] = useState<Database['public']['Tables']['homes']['Row'][]>([])
  const [formValues, setFormValues] = useState<HomecomingFormValues | undefined>(undefined)
  const [isConfirm, setIsConfirm] = useState<boolean>(false)

  useEffect(() => {
    const fetchHomes = async () => {
      const data = await fetchHomeList()
      setHomes(data || [])
    }

    fetchHomes()
  }, [])

  const today = new Date().toISOString().slice(0, 10)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<HomecomingFormValues>({
    resolver: zodResolver(homecomingFormSchema),
    defaultValues: {
      startDate: today,
      endDate: today,
      departureTime: '',
      returnTime: '',
      destination: '',
      specialReason: '',
      reason: '',
      mealDepartureBreakfast: false,
      mealDepartureDinner: false,
      mealReturnBreakfast: false,
      mealReturnDinner: false,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // 確認
  const onConfirm = (data: HomecomingFormValues) => {
    setFormValues(data)
    setIsConfirm(true)
  }

  // 送信
  const onSubmit: SubmitHandler<HomecomingFormValues> = async (data) => {
    setIsSubmitting(true)
    const parsedData = {
      ...data,
      destination: JSON.parse(data.destination),
    }
    try {
      await submitHomecomingForm(parsedData)
      toast.success('提出しました')
      router.push('/')
    } catch (e) {
      console.error(e)
      toast.error('提出に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 特別な事情の表示判定
  const departureTime = watch('departureTime')
  const returnTime = watch('returnTime')
  const showSpecialReason = isSpecialReasonRequired(departureTime, returnTime)

  if (!isConfirm) {
    return (
      <div className="bg-white h-full">
        <Header title="帰省届を出す" type="close" onClick={() => router.push('/')} />
        <form onSubmit={handleSubmit(onConfirm)} className="flex flex-col gap-4 p-3">
          <div className="flex gap-2">
            <InputLabel label="開始日" className="w-full">
              <Controller name="startDate" control={control} render={({ field }) => <DateInput {...field} />} />
            </InputLabel>

            <InputLabel label="終了日" className="w-full">
              <Controller name="endDate" control={control} render={({ field }) => <DateInput {...field} />} />
            </InputLabel>
          </div>
          {(errors.startDate || errors.endDate) && (
            <div className="text-red-500 text-xs mt-1">{errors.startDate?.message || errors.endDate?.message}</div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <InputLabel label="出発予定時刻" className="w-full">
                <Controller name="departureTime" control={control} render={({ field }) => <TimeInput {...field} />} />
                {errors.departureTime && (
                  <div className="text-red-500 text-xs mt-1">{errors.departureTime.message}</div>
                )}
              </InputLabel>
              <InputLabel label="帰寮予定時刻" className="w-full">
                <Controller name="returnTime" control={control} render={({ field }) => <TimeInput {...field} />} />
                {errors.returnTime && <div className="text-red-500 text-xs mt-1">{errors.returnTime.message}</div>}
              </InputLabel>
            </div>
            {showSpecialReason && (
              <div className="text-(--warn-text) bg-(--warn-background) border-(--warn-border) rounded-md p-2 text-[12px] font-[700]">
                <p>出発または帰省時刻が門限を過ぎています。</p>
                <p>特別な事情を記入してください。</p>
              </div>
            )}
          </div>
          <InputLabel label="帰省先">
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <BaseSelect
                  {...field}
                  value={field.value ?? ''}
                  options={homes.map((home) => ({
                    label: home.name,
                    value: JSON.stringify({ name: home.name, address: home.address }),
                  }))}
                  placeholder="プリセットから選択してください"
                  fullWidth
                />
              )}
            />
            {errors.destination && <div className="text-red-500 text-xs mt-1">{errors.destination.message}</div>}
          </InputLabel>
          <InputLabel label="帰省理由">
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  className="w-full border rounded p-2 min-h-[48px]"
                  placeholder="理由を入力してください"
                />
              )}
            />
            {errors.reason && <div className="text-red-500 text-xs mt-1">{errors.reason.message}</div>}
          </InputLabel>
          {showSpecialReason && (
            <InputLabel label="特別な事情">
              <Controller
                name="specialReason"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    className="w-full border rounded p-2 min-h-[48px]"
                    placeholder="特別な事情を入力してください"
                  />
                )}
              />
              {errors.specialReason && <div className="text-red-500 text-xs mt-1">{errors.specialReason.message}</div>}
            </InputLabel>
          )}
          {/* TODO 朝 朝 とチェックつけると 自動で間の夕の欠食にするような処理 or バリデーション */}
          <InputLabel label={`帰省日（${dayjs(watch('startDate')).format('MM/DD')}）の食事`}>
            <div className="flex gap-4">
              <Controller
                name="mealDepartureBreakfast"
                control={control}
                render={({ field: { onChange, name, value, ...rest } }) => (
                  <CheckboxField
                    checked={value}
                    onCheckedChange={onChange}
                    name={name}
                    label="朝食を欠食する"
                    disabled={rest.disabled}
                  />
                )}
              />
              <Controller
                name="mealDepartureDinner"
                control={control}
                render={({ field: { onChange, name, value, ...rest } }) => (
                  <CheckboxField
                    checked={value}
                    onCheckedChange={onChange}
                    name={name}
                    label="夕食を欠食する"
                    disabled={rest.disabled}
                  />
                )}
              />
            </div>
          </InputLabel>
          <InputLabel label={`帰寮日（${dayjs(watch('endDate')).format('MM/DD')}）の食事`}>
            <div className="flex gap-4">
              <Controller
                name="mealReturnBreakfast"
                control={control}
                render={({ field: { onChange, name, value, ...rest } }) => (
                  <CheckboxField
                    checked={value}
                    onCheckedChange={onChange}
                    name={name}
                    label="朝食を欠食する"
                    disabled={rest.disabled}
                  />
                )}
              />
              <Controller
                name="mealReturnDinner"
                control={control}
                render={({ field: { onChange, name, value, ...rest } }) => (
                  <CheckboxField
                    checked={value}
                    onCheckedChange={onChange}
                    name={name}
                    label="夕食を欠食する"
                    disabled={rest.disabled}
                  />
                )}
              />
            </div>
          </InputLabel>
          <p className="text-sm text-(--sub-text)">※期間中の欠食は自動で欠食されます</p>
          <Button className="w-full mt-4" type="submit">
            確認する
          </Button>
        </form>
      </div>
    )
  }
  if (isConfirm && formValues) {
    return (
      <div className="bg-white h-full">
        <Header title="入力内容の確認" type="back" onClick={() => setIsConfirm(false)} />
        <div className="p-3 gap-4 flex flex-col">
          <div className="text-center bg-(--red) rounded-lg px-4 py-3 text-white font-bold text-lg">
            <p>本当に以下の日時・欠食・帰省先で大丈夫なのか</p>
            <p>しっかり確認してください！！</p>
          </div>

          <InputLabel label="帰省期間">
            <div className="text-base font-bold">
              {dayjs(formValues.startDate).format('YYYY/MM/DD')} {formValues.departureTime}
              <span className="font-normal mx-2">〜</span>
              {dayjs(formValues.endDate).format('YYYY/MM/DD')} {formValues.returnTime}
            </div>
          </InputLabel>

          <InputLabel label="帰省先">
            <div className="text-base text-(--sub-text)">
              ({JSON.parse(formValues.destination).name})
              <span className="font-normal ml-1 text-(--main-text) text-xl">
                {JSON.parse(formValues.destination).address}
              </span>
            </div>
          </InputLabel>

          <InputLabel label="帰省理由">
            <div className="text-base text-(--main-text)">{formValues.reason}</div>
          </InputLabel>

          {(() => {
            if (isSpecialReasonRequired(formValues.departureTime, formValues.returnTime)) {
              return (
                <InputLabel label="特別な事情">
                  <div className="text-base">{formValues.specialReason}</div>
                </InputLabel>
              )
            }
            return null
          })()}

          <InputLabel label={`帰省日（${dayjs(formValues.startDate).format('MM/DD')}）の食事`}>
            <div>
              朝食: {formValues.mealDepartureBreakfast ? '欠食' : '喫食'} ／ 夕食:{' '}
              {formValues.mealDepartureDinner ? '欠食' : '喫食'}
            </div>
          </InputLabel>
          <InputLabel label={`帰寮日（${dayjs(formValues.endDate).format('MM/DD')}）の食事`}>
            <div>
              朝食: {formValues.mealReturnBreakfast ? '欠食' : '喫食'} ／ 夕食:{' '}
              {formValues.mealReturnDinner ? '欠食' : '喫食'}
            </div>
          </InputLabel>

          <div className="text-center text-xl text-black font-extrabold">
            <p>上記の内容で問題がなければ、</p>
            <p>下の「この内容で提出」を押してください</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              className="w-full font-bold"
              type="submit"
              disabled={isSubmitting}
              onClick={() => onSubmit(formValues)}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner /> 提出中...
                </>
              ) : (
                'この内容で提出する'
              )}
            </Button>
            <Button
              className="w-full font-bold"
              type="button"
              variant="destructive"
              onClick={() => setIsConfirm(false)}
            >
              内容を修正する
            </Button>
          </div>
        </div>
      </div>
    )
  }
}
