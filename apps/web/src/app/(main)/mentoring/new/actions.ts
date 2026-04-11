'use server'

import { redirect } from 'next/navigation'

import { venueToRoomId } from '@/app/(main)/room/lib/room-mentoring'
import { performRoomReservation } from '@/lib/actions/reserve-room'
import { createClient } from '@/lib/client'
import { AuthenticationError, type RoomCard } from '@/lib/sdk'

interface CreateMentoringState {
  error: string
}

export async function createMentoring(
  _prevState: CreateMentoringState,
  formData: FormData,
): Promise<CreateMentoringState> {
  const title = String(formData.get('title') ?? '').trim()
  const type = String(formData.get('type') ?? '')
  const date = String(formData.get('date') ?? '')
  const startTime = String(formData.get('startTime') ?? '')
  const endTime = String(formData.get('endTime') ?? '')
  const venue = String(formData.get('venue') ?? '')
  const maxAttendees = String(formData.get('maxAttendees') ?? '')
  const regStart = String(formData.get('regStart') ?? '')
  const regEnd = String(formData.get('regEnd') ?? '')
  const content = String(formData.get('content') ?? '').trim()

  if (!title || !type || !date || !startTime || !endTime || !venue) {
    return { error: '필수 항목을 모두 입력해주세요.' }
  }

  if (startTime >= endTime) {
    return { error: '종료 시간은 시작 시간보다 늦어야 합니다.' }
  }

  try {
    const client = await createClient()
    await client.mentoring.create({
      title,
      type: type === 'lecture' ? 'lecture' : 'public',
      date,
      startTime,
      endTime,
      venue,
      maxAttendees: maxAttendees ? Number(maxAttendees) : undefined,
      regStart: regStart || undefined,
      regEnd: regEnd || undefined,
      content: content || undefined,
    })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/login')
    }
    return { error: error instanceof Error ? error.message : '멘토링 등록에 실패했습니다.' }
  }

  redirect('/mentoring')
}

export async function fetchRoomAvailability(
  date: string,
  venue: string,
): Promise<{ slots: Array<{ time: string; available: boolean }> } | { error: string }> {
  const roomId = venueToRoomId(venue)

  if (!roomId) {
    return { error: '예약할 수 없는 장소입니다.' }
  }

  if (!date) {
    return { error: '날짜를 선택해주세요.' }
  }

  try {
    const client = await createClient()
    const slots = await client.room.available(roomId, date)
    return { slots }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/login')
    }
    return { error: error instanceof Error ? error.message : '회의실 정보를 불러오지 못했습니다.' }
  }
}

export async function fetchRooms(date: string, room?: string): Promise<RoomCard[]> {
  try {
    const client = await createClient()
    return await client.room.list({ date, room: room || undefined })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/login')
    }
    throw error
  }
}

export async function reserveRoomFromMentoring(params: {
  venue: string
  date: string
  slots: string[]
  title: string
}): Promise<{ error: string; success: string }> {
  const roomId = venueToRoomId(params.venue)

  if (!roomId) {
    return { error: '예약할 수 없는 장소입니다.', success: '' }
  }

  return performRoomReservation({
    roomId,
    date: params.date,
    slots: params.slots,
    title: params.title,
  })
}
