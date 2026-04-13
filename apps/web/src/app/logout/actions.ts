'use server'

import { redirect } from 'next/navigation'

import { SomaClient } from '@/lib/sdk'
import { getSession } from '@/lib/session'

export async function logout() {
  const session = await getSession()

  if (session.sessionCookie && session.csrfToken) {
    const client = new SomaClient({
      sessionCookie: session.sessionCookie,
      csrfToken: session.csrfToken,
    })

    try {
      await client.logout()
    } catch {}
  }

  session.destroy()
  redirect('/login')
}
