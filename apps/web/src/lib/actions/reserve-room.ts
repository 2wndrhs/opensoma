'use server'

import { redirect } from 'next/navigation'

import { createClient } from '@/lib/client'
import { AuthenticationError } from '@/lib/sdk'

interface ReserveRoomParams {
  roomId: number
  date: string
  slots: string[]
  title: string
  attendees?: number
  notes?: string
}

interface ReserveRoomResult {
  error: string
  success: string
}

export async function performRoomReservation(params: ReserveRoomParams): Promise<ReserveRoomResult> {
  const { roomId, date, slots, title, attendees, notes } = params

  if (!roomId || !date || !title || slots.length === 0) {
    return { error: '예약 정보가 올바르지 않습니다.', success: '' }
  }

  try {
    const client = await createClient()
    await client.room.reserve({
      roomId,
      date,
      slots,
      title,
      attendees,
      notes,
    })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/login')
    }
    return {
      error: error instanceof Error ? error.message : '회의실 예약에 실패했습니다.',
      success: '',
    }
  }

  return { error: '', success: '회의실 예약이 완료되었습니다.' }
}
