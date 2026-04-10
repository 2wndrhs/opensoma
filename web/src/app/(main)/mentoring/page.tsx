import Link from 'next/link'

import { MentoringFilters } from '~/app/(main)/mentoring/components/mentoring-filters'
import { Pagination } from '~/components/pagination'
import { StatusBadge } from '~/components/status-badge'
import { requireAuth } from '~/lib/auth'
import { Button } from '~/ui/button'
import { Card, CardContent } from '~/ui/card'
import { EmptyState } from '~/ui/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/ui/table'

export default async function MentoringPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(getFirstValue(resolvedSearchParams.page) ?? '1') || 1
  const status = getFirstValue(resolvedSearchParams.status) ?? undefined
  const type = getFirstValue(resolvedSearchParams.type) ?? undefined
  const client = await requireAuth()
  const mentoring = await client.mentoring.list({ page, status, type })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">멘토링 / 특강 게시판</h1>
          <p className="text-sm text-foreground-muted">모집 중인 멘토링과 특강을 확인하고 새 글을 등록하세요.</p>
        </div>
        <div className="flex gap-2">
          <form action="/mentoring/history">
            <Button type="submit" variant="secondary">
              신청 내역
            </Button>
          </form>
          <form action="/mentoring/create">
            <Button type="submit">글쓰기</Button>
          </form>
        </div>
      </div>

      <MentoringFilters />

      {mentoring.items.length === 0 ? (
        <Card className="border border-border">
          <CardContent>
            <EmptyState message="조건에 맞는 멘토링이 없습니다." />
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유형</TableHead>
              <TableHead className="w-[32%]">제목</TableHead>
              <TableHead>접수 기간</TableHead>
              <TableHead>진행 일시</TableHead>
              <TableHead>인원</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작성자</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentoring.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <Link className="font-medium text-foreground hover:text-primary" href={`/mentoring/${item.id}`}>
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {item.registrationPeriod.start} ~ {item.registrationPeriod.end}
                </TableCell>
                <TableCell>
                  <div>{item.sessionDate}</div>
                  <div className="text-xs text-foreground-muted">
                    {item.sessionTime.start} ~ {item.sessionTime.end}
                  </div>
                </TableCell>
                <TableCell>
                  {item.attendees.current} / {item.attendees.max}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>{item.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination pagination={mentoring.pagination} pathname="/mentoring" searchParams={{ status, type }} />
    </div>
  )
}

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}
