import { AuthenticationError, SomaClient } from '@/lib/sdk'
import { getSession } from '@/lib/session'

const NOT_AUTHENTICATED_MESSAGE = 'Not authenticated'

type SessionLike = {
  isLoggedIn?: boolean
  sessionCookie?: string
  csrfToken?: string
  destroy(): void
}

export async function validateClientSession<T extends Pick<SomaClient, 'isLoggedIn'>>(
  session: SessionLike,
  client: T,
): Promise<T> {
  if (!session.isLoggedIn || !session.sessionCookie || !session.csrfToken) {
    throw new AuthenticationError(NOT_AUTHENTICATED_MESSAGE)
  }

  const isValid = await client.isLoggedIn()
  if (!isValid) {
    session.destroy()
    throw new AuthenticationError(NOT_AUTHENTICATED_MESSAGE)
  }

  return client
}

export async function createClient(): Promise<SomaClient> {
  const session = await getSession()
  const client = new SomaClient({
    sessionCookie: session.sessionCookie,
    csrfToken: session.csrfToken,
    verbose: process.env.OPENSOMA_VERBOSE === 'true',
  })

  return validateClientSession(session, client)
}
