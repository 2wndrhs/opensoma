import { requireAuth } from '~/lib/auth'
import { Badge } from '~/ui/badge'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { EmptyState } from '~/ui/empty-state'

export default async function DashboardPage() {
  const client = await requireAuth()
  const dashboard = await client.dashboard.get()

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">대시보드</h1>
        <p className="text-sm text-foreground-muted">마이페이지 주요 정보를 한눈에 확인하세요.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border border-border">
          <CardHeader>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">사용자 정보</h2>
              <p className="text-sm text-foreground-muted">현재 로그인한 계정 정보입니다.</p>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="이름" value={dashboard.name} />
              <InfoItem label="역할" value={dashboard.role} />
              <InfoItem label="소속" value={dashboard.organization || '-'} />
              <InfoItem label="직책" value={dashboard.position || '-'} />
            </dl>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">팀 정보</h2>
              <p className="text-sm text-foreground-muted">현재 매칭된 팀 현황입니다.</p>
            </div>
          </CardHeader>
          <CardContent>
            {dashboard.team ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                <InfoItem label="팀명" value={dashboard.team.name} />
                <InfoItem label="멘토" value={dashboard.team.mentor} />
                <InfoItem className="sm:col-span-2" label="팀원" value={dashboard.team.members} />
              </dl>
            ) : (
              <EmptyState message="현재 배정된 팀 정보가 없습니다." />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <StatusCard
          description="진행 중인 멘토링과 특강 상태입니다."
          items={dashboard.mentoringSessions}
          title="멘토링 / 특강"
        />
        <StatusCard description="예약한 회의실 현황입니다." items={dashboard.roomReservations} title="회의실 예약" />
      </div>
    </div>
  )
}

function StatusCard({
  title,
  description,
  items,
}: {
  title: string
  description: string
  items: Array<{ title: string; url: string; status: string }>
}) {
  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState message="표시할 내역이 없습니다." />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={`${item.url}-${item.title}`}
                className="flex items-center justify-between gap-4 rounded-md border border-border p-4"
              >
                <a className="text-sm font-medium text-foreground hover:text-primary" href={toInternalHref(item.url)}>
                  {item.title}
                </a>
                <Badge variant={item.status.includes('완료') ? 'success' : 'primary'}>{item.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-sm text-foreground-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function toInternalHref(url: string) {
  const parsed = new URL(url, 'https://www.swmaestro.ai')
  const pathname = parsed.pathname
  const mentoringId = parsed.searchParams.get('qustnrSn')
  const noticeId = parsed.searchParams.get('nttId')

  if (pathname.includes('/mentoLec/view.do') && mentoringId) {
    return `/mentoring/${mentoringId}`
  }

  if (pathname.includes('/myNotice/view.do') && noticeId) {
    return `/notice/${noticeId}`
  }

  if (pathname.includes('/itemRent/') || pathname.includes('/officeMng/')) {
    return '/room'
  }

  return '/dashboard'
}
