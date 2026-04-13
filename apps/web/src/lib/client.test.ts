import { describe, expect, it } from 'bun:test'

import { AuthenticationError } from '@/lib/sdk'

import { validateClientSession } from './client'

describe('validateClientSession', () => {
  it('throws when the local session is missing', async () => {
    await expect(
      validateClientSession(
        {
          isLoggedIn: false,
        },
        {
          isLoggedIn: async () => true,
        },
      ),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('throws when upstream auth is invalid without mutating the local session', async () => {
    await expect(
      validateClientSession(
        {
          isLoggedIn: true,
          sessionCookie: 'session-cookie',
          csrfToken: 'csrf-token',
        },
        {
          isLoggedIn: async () => false,
        },
      ),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('returns the client when both local and upstream auth are valid', async () => {
    const client = {
      isLoggedIn: async () => true,
    }

    await expect(
      validateClientSession(
        {
          isLoggedIn: true,
          sessionCookie: 'session-cookie',
          csrfToken: 'csrf-token',
        },
        client,
      ),
    ).resolves.toBe(client)
  })
})
