import { describe, expect, it } from 'bun:test'

import { AuthenticationError } from '@/lib/sdk'

import { validateClientSession } from './client'

describe('validateClientSession', () => {
  it('throws when the local session is missing', async () => {
    await expect(
      validateClientSession(
        {
          isLoggedIn: false,
          destroy() {},
        },
        {
          isLoggedIn: async () => true,
        },
      ),
    ).rejects.toBeInstanceOf(AuthenticationError)
  })

  it('destroys the local session when upstream auth is invalid', async () => {
    let destroyed = false

    await expect(
      validateClientSession(
        {
          isLoggedIn: true,
          sessionCookie: 'session-cookie',
          csrfToken: 'csrf-token',
          destroy() {
            destroyed = true
          },
        },
        {
          isLoggedIn: async () => false,
        },
      ),
    ).rejects.toBeInstanceOf(AuthenticationError)

    expect(destroyed).toBe(true)
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
          destroy() {},
        },
        client,
      ),
    ).resolves.toBe(client)
  })
})
