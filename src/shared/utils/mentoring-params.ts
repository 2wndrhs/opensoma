import { MENU_NO } from '@/constants'
import type { UserIdentity } from '@/http'

export function buildMentoringListParams(options?: {
  status?: string
  type?: string
  page?: string | number
  user?: UserIdentity
}): Record<string, string> {
  const params: Record<string, string> = { menuNo: MENU_NO.MENTORING }

  if (options?.status === 'my' && options.user) {
    params.searchCnd = '2'
    params.searchId = options.user.userId
    params.searchWrd = options.user.userNm
  } else if (options?.status) {
    params.searchStatMentolec = options.status
  }

  if (options?.type) params.searchGubunMentolec = options.type
  if (options?.page) params.pageIndex = String(options.page)

  return params
}
