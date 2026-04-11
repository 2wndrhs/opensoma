import { redirect } from 'next/navigation'

import { SomaClient, AuthenticationError } from '@/lib/sdk'
import { getSession } from '@/lib/session'

export async function requireAuth(): Promise<SomaClient> {
  const session = await getSession()
  if (!session.isLoggedIn || !session.sessionCookie || !session.csrfToken) {
    redirect('/login')
  }

  const client = new SomaClient({
    sessionCookie: session.sessionCookie,
    csrfToken: session.csrfToken,
  })

  try {
    const isValid = await client.isLoggedIn()
    if (!isValid) {
      redirect('/login')
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('/login')
    }
    throw error
  }

  return client
}
