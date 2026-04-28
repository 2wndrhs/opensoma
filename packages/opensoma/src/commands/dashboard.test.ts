import { describe, expect, it } from 'bun:test'

import type { SomaHttp } from '../http'
import type { Dashboard } from '../types'
import { showDashboard } from './dashboard'

describe('showDashboard', () => {
  it('prints the SDK dashboard response', async () => {
    const dashboard: Dashboard = {
      name: '김연수',
      role: '17기 연수생',
      organization: 'OpenSoma',
      position: '',
      mentoringSessions: [
        {
          title: '팀 프로젝트 방향성 피드백',
          url: '/sw/mypage/mentoLec/view.do?qustnrSn=44',
          status: '접수완료',
          date: '2026-04-28',
          time: '22:00',
          timeEnd: '24:00',
          type: '자유 멘토링',
        },
      ],
      roomReservations: [],
    }
    const fakeHttp = {} as SomaHttp
    const calls: string[] = []
    const outputs: string[] = []

    await showDashboard(
      { pretty: true },
      {
        getHttp: async () => {
          calls.push('getHttp')
          return fakeHttp
        },
        createClient: (http) => {
          expect(http).toBe(fakeHttp)
          calls.push('createClient')
          return {
            dashboard: {
              get: async () => {
                calls.push('dashboard.get')
                return dashboard
              },
            },
          }
        },
        write: (output) => outputs.push(output),
      },
    )

    expect(calls).toEqual(['getHttp', 'createClient', 'dashboard.get'])
    expect(outputs).toEqual([JSON.stringify(dashboard, null, 2)])
  })
})
