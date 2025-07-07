import type { Meta, StoryObj } from '@storybook/nextjs'

import Index from './index'

const meta = {
  component: Index,
} satisfies Meta<typeof Index>

export default meta

type Story = StoryObj<typeof meta>

export const Homecoming: Story = {
  args: {
    status: 'pending',
    type: 'homecoming',
    createdAt: '2025/01/01',
    period: {
      startDate: new Date('2025/01/01 18:00'),
      endDate: new Date('2025/01/10 20:00'),
    },
    homecoming: {
      id: '1',
      place: '実家',
    },
    meal: {
      startDate: {
        morning: false,
        evening: true,
      },
      endDate: {
        morning: false,
        evening: true,
      },
    },
  },
}

export const Meal: Story = {
  args: {
    status: 'approved',
    type: 'meal',
    createdAt: '2025/01/01',
    period: {
      startDate: new Date('2025/01/01 18:00'),
      endDate: new Date('2025/01/10 20:00'),
    },
    meal: {
      startDate: {
        morning: true,
        evening: false,
      },
      endDate: {
        morning: false,
        evening: true,
      },
    },
  },
}
