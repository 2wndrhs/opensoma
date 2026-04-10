'use client'

import { useMemo, useState } from 'react'

interface TimeSlotGridProps {
  slots: Array<{ time: string; available: boolean }>
  selectedSlots: string[]
  onChange: (slots: string[]) => void
}

const allSlots = createAllSlots()

export function TimeSlotGrid({ slots, selectedSlots, onChange }: TimeSlotGridProps) {
  const [error, setError] = useState('')
  const slotMap = useMemo(() => new Map(slots.map((slot) => [slot.time, slot.available])), [slots])

  function handleSelect(time: string) {
    const available = slotMap.get(time)

    if (!available) {
      return
    }

    if (selectedSlots.includes(time)) {
      setError('')
      onChange([])
      return
    }

    const next = [...selectedSlots, time].sort((left, right) => allSlots.indexOf(left) - allSlots.indexOf(right))

    if (next.length > 8) {
      setError('최대 8개(4시간)까지 연속 선택할 수 있습니다.')
      return
    }

    for (let index = 1; index < next.length; index += 1) {
      if (allSlots.indexOf(next[index]) !== allSlots.indexOf(next[index - 1]) + 1) {
        setError('연속된 30분 단위 시간만 선택할 수 있습니다.')
        return
      }
    }

    setError('')
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2 md:grid-cols-6 xl:grid-cols-8">
        {slots.map((slot) => {
          const selected = selectedSlots.includes(slot.time)
          const className = selected
            ? 'border-blue-600 bg-blue-50 text-blue-700'
            : slot.available
              ? 'border-green-200 bg-green-50 text-green-700 hover:border-green-300'
              : 'cursor-not-allowed border-border bg-muted text-foreground-muted'

          return (
            <button
              key={slot.time}
              className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${className}`}
              disabled={!slot.available}
              type="button"
              onClick={() => handleSelect(slot.time)}
            >
              {slot.time}
            </button>
          )
        })}
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  )
}

function createAllSlots() {
  const result: string[] = []

  for (let hour = 9; hour <= 23; hour += 1) {
    result.push(`${String(hour).padStart(2, '0')}:00`, `${String(hour).padStart(2, '0')}:30`)
  }

  return result
}
