import { describe, expect, test } from 'bun:test'

import { createAuthenticatedHttp } from './helpers'

describe('createAuthenticatedHttp', () => {
  test('throws a login hint when no credentials are stored', async () => {
    const manager = {
      getCredentials: async () => null,
      remove: async () => {},
    }

    await expect(createAuthenticatedHttp(manager)).rejects.toThrow(
      'Not logged in. Run: opensoma auth login or opensoma auth extract',
    )
  })

  test('clears stale credentials when the stored session is invalid', async () => {
    let removed = false
    const manager = {
      getCredentials: async () => ({
        sessionCookie: 'stale-session',
        csrfToken: 'csrf-token',
      }),
      setCredentials: async () => {
        throw new Error('should not save unrecoverable credentials')
      },
      remove: async () => {
        removed = true
      },
    }

    await expect(
      createAuthenticatedHttp(manager, () => ({
        checkLogin: async () => null,
      })),
    ).rejects.toThrow(
      'Session expired. Saved credentials were cleared. Run: opensoma auth login or opensoma auth extract',
    )
    expect(removed).toBe(true)
  })

  test('returns the authenticated http client when the session is valid', async () => {
    const http = {
      checkLogin: async () => ({ userId: 'neo@example.com', userNm: '전수열' }),
      get: async () => '',
    }
    const manager = {
      getCredentials: async () => ({
        sessionCookie: 'valid-session',
        csrfToken: 'csrf-token',
      }),
      setCredentials: async () => {
        throw new Error('should not rewrite valid credentials')
      },
      remove: async () => {
        throw new Error('should not remove valid credentials')
      },
    }

    await expect(createAuthenticatedHttp(manager, () => http)).resolves.toBe(http)
  })

  test('re-authenticates automatically when stored username/password are available', async () => {
    let savedCredentials: Record<string, string> | null = null
    const manager = {
      getCredentials: async () => ({
        sessionCookie: 'stale-session',
        csrfToken: 'stale-csrf',
        username: 'neo@example.com',
        password: 'secret',
      }),
      setCredentials: async (credentials: Record<string, string>) => {
        savedCredentials = credentials
      },
      remove: async () => {
        throw new Error('should not remove recoverable credentials')
      },
    }
    const recoveredHttp = { checkLogin: async () => ({ userId: 'neo@example.com', userNm: 'Neo' }), get: async () => '' }

    await expect(
      createAuthenticatedHttp(
        manager,
        (credentials) => {
          if (credentials.sessionCookie === 'fresh-session') {
            return recoveredHttp
          }

          return {
            checkLogin: async () => null,
          }
        },
        () => ({
          login: async () => {},
          checkLogin: async () => ({ userId: 'neo@example.com', userNm: 'Neo' }),
          getSessionCookie: () => 'fresh-session',
          getCsrfToken: () => 'fresh-csrf',
        }),
      ),
    ).resolves.toBe(recoveredHttp)

    expect(savedCredentials).toMatchObject({
      sessionCookie: 'fresh-session',
      csrfToken: 'fresh-csrf',
      username: 'neo@example.com',
      password: 'secret',
    })
  })
})
