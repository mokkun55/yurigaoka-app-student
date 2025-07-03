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

const homecomingFormSchema = z.object({
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
})

export type HomecomingFormValues = z.infer<typeof homecomingFormSchema>

export default function AbsenceHome() {
  const [homes, setHomes] = useState<Database['public']['Tables']['homes']['Row'][]>([])

  useEffect(() => {
    const fetchHomes = async () => {
      const data = await fetchHomeList()
      setHomes(data || [])
    }

    fetchHomes()
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<HomecomingFormValues>({
    resolver: zodResolver(homecomingFormSchema),
    defaultValues: {
      startDate: '',
      endDate: '',
      departureTime: '',
      returnTime: '',
      destination: '',
      reason: '',
      mealDepartureBreakfast: false,
      mealDepartureDinner: false,
      mealReturnBreakfast: false,
      mealReturnDinner: false,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit: SubmitHandler<HomecomingFormValues> = async (data) => {
    setIsSubmitting(true)
    const parsedData = {
      ...data,
      destination: JSON.parse(data.destination),
    }
    await submitHomecomingForm(parsedData)
    setIsSubmitting(false)
  }

  return (
    <div className="bg-white">
      <Header title="帰省届を出す" type="close" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4 py-2">
        <InputLabel label="帰省日">
          <div className="flex gap-2 w-full items-center">
            <div className="w-full">
              <Controller name="startDate" control={control} render={({ field }) => <DateInput {...field} />} />
            </div>
            <span className="mx-1">〜</span>
            <div className="w-full">
              <Controller name="endDate" control={control} render={({ field }) => <DateInput {...field} />} />
            </div>
          </div>
          {(errors.startDate || errors.endDate) && (
            <div className="text-red-500 text-xs mt-1">{errors.startDate?.message || errors.endDate?.message}</div>
          )}
        </InputLabel>
        <div className="flex gap-2 w-full">
          <InputLabel label="出発予定時刻" className="w-full">
            <Controller
              name="departureTime"
              control={control}
              render={({ field }) => <TimeInput {...field} className="w-full" />}
            />
            {errors.departureTime && <div className="text-red-500 text-xs mt-1">{errors.departureTime.message}</div>}
          </InputLabel>
          <InputLabel label="帰寮予定時刻" className="w-full">
            <Controller
              name="returnTime"
              control={control}
              render={({ field }) => <TimeInput {...field} className="w-full" />}
            />
            {errors.returnTime && <div className="text-red-500 text-xs mt-1">{errors.returnTime.message}</div>}
          </InputLabel>
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
        <InputLabel label="帰省日の食事">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
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
            </label>
            <label className="flex items-center gap-2">
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
            </label>
          </div>
        </InputLabel>
        <InputLabel label="帰寮日の食事">
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
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
            </label>
            <label className="flex items-center gap-2">
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
            </label>
          </div>
        </InputLabel>
        <Button className="w-full mt-4" type="submit" disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : '確認する'}
        </Button>
      </form>
    </div>
  )
}
