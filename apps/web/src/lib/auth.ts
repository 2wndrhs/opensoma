import { redirect } from 'next/navigation'

import { createClient } from '@/lib/client'
import { AuthenticationError, type SomaClient } from '@/lib/sdk'

export async function requireAuth(): Promise<SomaClient> {
  try {
    return await createClient()
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/logout')
    }
    throw error
  }
}
