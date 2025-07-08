'use client'

import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Header from '@/_components/ui/header'
import InputLabel from '@/_components/ui/input-label'
import { Button } from '@/_components/ui/button'
import { CheckboxField } from '@/_components/ui/checkbox/checkbox-field'
import { useState } from 'react'
import { DateInput } from '@/_components/ui/input/date-input'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { submitMealForm } from './actions'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import ja from 'dayjs/locale/ja'
import ConfirmAbsenceDialog from '../_components/ConfirmAbsenceDialog'
import { formatDateWithWeekday } from '@/utils/dateUtils'
dayjs.extend(weekday)
dayjs.locale(ja)

const mealFormSchema = z
  .object({
    startDate: z.string().min(1, '開始日を選択してください'),
    endDate: z.string().min(1, '終了日を選択してください'),
    breakfast: z.boolean().optional(),
    dinner: z.boolean().optional(),
    startBreakfast: z.boolean().optional(),
    startDinner: z.boolean().optional(),
    endBreakfast: z.boolean().optional(),
    endDinner: z.boolean().optional(),
    reason: z.string().min(1, '理由を入力してください'),
    meals: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    // 開始日 <= 終了日
    if (new Date(data.startDate) > new Date(data.endDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: '開始日は終了日より前または同じ日付を選択してください',
      })
    }

    // 3日前までに提出
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const threeDaysLater = new Date(today)
    threeDaysLater.setDate(today.getDate() + 3)
    if (new Date(data.startDate) < threeDaysLater) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: '欠食届は3日前までに提出してください',
      })
    }

    // 食事選択
    if (data.startDate === data.endDate) {
      if (!data.breakfast && !data.dinner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['meals'],
          message: 'いずれかの食事を選択してください',
        })
      }
    } else {
      if (!data.startBreakfast && !data.startDinner && !data.endBreakfast && !data.endDinner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['meals'],
          message: 'いずれかの食事を選択してください',
        })
      }
    }
  })

export type MealFormValues = z.infer<typeof mealFormSchema>

export default function Meal() {
  const router = useRouter()
  const [formValues, setFormValues] = useState<MealFormValues | undefined>(undefined)
  const [isConfirm, setIsConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = dayjs().format('YYYY-MM-DD')

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: {
      startDate: today,
      endDate: today,
      breakfast: false,
      dinner: false,
      startBreakfast: false,
      startDinner: false,
      endBreakfast: false,
      endDinner: false,
      reason: '',
    },
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const isOneDay = startDate === endDate

  const onConfirm = (data: MealFormValues) => {
    setFormValues(data)
    setIsConfirm(true)
  }

  const onSubmit: SubmitHandler<MealFormValues> = async (data) => {
    setIsSubmitting(true)
    try {
      await submitMealForm(data)
      toast.success('提出しました')
      router.push('/')
    } catch (e) {
      console.error(e)
      toast.error('提出に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConfirm) {
    return (
      <div className="bg-white h-full w-full max-w-screen overflow-x-hidden">
        <Header title="欠食届を出す" type="close" />
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
          {errors.root && <div className="text-red-500 text-xs mt-1">{errors.root.message}</div>}
          {isOneDay ? (
            <InputLabel label="欠食する食事">
              <div className="flex gap-4">
                <Controller
                  name="breakfast"
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
                  name="dinner"
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
              {errors.meals && typeof errors.meals.message === 'string' && (
                <div className="text-red-500 text-xs mt-1">{errors.meals.message}</div>
              )}
              {errors.breakfast && <div className="text-red-500 text-xs mt-1">{errors.breakfast.message}</div>}
            </InputLabel>
          ) : (
            <>
              <InputLabel label={`開始日（${formatDateWithWeekday(startDate)}）の食事`}>
                <div className="flex gap-4">
                  <Controller
                    name="startBreakfast"
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
                    name="startDinner"
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
              <InputLabel label={`終了日（${formatDateWithWeekday(endDate)}）の食事`}>
                <div className="flex gap-4">
                  <Controller
                    name="endBreakfast"
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
                    name="endDinner"
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
              {errors.meals && typeof errors.meals.message === 'string' && (
                <div className="text-red-500 text-xs mt-1">{errors.meals.message}</div>
              )}
              {errors.breakfast && <div className="text-red-500 text-xs mt-1">{errors.breakfast.message}</div>}
            </>
          )}
          <InputLabel label="欠食理由">
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
          <Button className="w-full mt-4" type="submit">
            確認する
          </Button>
        </form>
      </div>
    )
  }

  if (isConfirm && formValues) {
    const isOneDay = formValues.startDate === formValues.endDate
    const periodValue = isOneDay ? (
      formatDateWithWeekday(formValues.startDate)
    ) : (
      <>
        <span>{formatDateWithWeekday(formValues.startDate)}</span>
        <span className="mx-2">〜</span>
        <span>{formatDateWithWeekday(formValues.endDate)}</span>
      </>
    )
    const meals = isOneDay
      ? [
          {
            label: '欠食する食事',
            value: `朝食: ${formValues.breakfast ? '欠食' : '喫食'} ／ 夕食: ${formValues.dinner ? '欠食' : '喫食'}`,
          },
        ]
      : [
          {
            label: `開始日（${formatDateWithWeekday(formValues.startDate)}）の食事`,
            value: `朝食: ${formValues.startBreakfast ? '欠食' : '喫食'} ／ 夕食: ${formValues.startDinner ? '欠食' : '喫食'}`,
          },
          {
            label: `終了日（${formatDateWithWeekday(formValues.endDate)}）の食事`,
            value: `朝食: ${formValues.endBreakfast ? '欠食' : '喫食'} ／ 夕食: ${formValues.endDinner ? '欠食' : '喫食'}`,
          },
        ]
    return (
      <ConfirmAbsenceDialog
        title="入力内容の確認"
        periodLabel="欠食期間"
        periodValue={periodValue}
        meals={meals}
        reasonLabel="欠食理由"
        reasonValue={formValues.reason}
        onSubmit={() => onSubmit(formValues)}
        onBack={() => setIsConfirm(false)}
        isSubmitting={isSubmitting}
      />
    )
  }
  return null
}
