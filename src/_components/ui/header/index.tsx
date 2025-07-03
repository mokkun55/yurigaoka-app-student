'use client'

import { X, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  type?: 'back' | 'close' | 'none'
}

export default function Header({ title, type = 'none' }: Props) {
  const router = useRouter()

  const handleIconClick = () => {
    if (type === 'back') {
      router.back()
    }
  }

  return (
    <div className="flex items-center bg-white h-12 border-b border-(--border-gray) relative">
      <button className="p-4 cursor-pointer" onClick={handleIconClick}>
        {type === 'back' && <ChevronLeft size={24} />}
        {type === 'close' && <X size={24} />}
      </button>
      <h1 className="absolute left-1/2 -translate-x-1/2">{title}</h1>
    </div>
  )
}
