import Link from 'next/link'

import { Pagination } from '~/components/pagination'
import { StatusBadge } from '~/components/status-badge'
import { requireAuth } from '~/lib/auth'
import { Card, CardContent } from '~/ui/card'
import { EmptyState } from '~/ui/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/ui/table'

export default async function EventPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(getFirstValue(resolvedSearchParams.page) ?? '1') || 1
  const client = await requireAuth()
  const events = await client.event.list({ page })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">행사 게시판</h1>
        <p className="text-sm text-foreground-muted">행사 일정과 접수 기간을 확인하세요.</p>
      </div>

      {events.items.length === 0 ? (
        <Card className="border border-border">
          <CardContent>
            <EmptyState message="등록된 행사가 없습니다." />
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>구분</TableHead>
              <TableHead className="w-[28%]">제목</TableHead>
              <TableHead>접수 기간</TableHead>
              <TableHead>행사 기간</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <Link className="font-medium text-foreground hover:text-primary" href={`/event/${item.id}`}>
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {item.registrationPeriod.start} ~ {item.registrationPeriod.end}
                </TableCell>
                <TableCell>
                  {item.eventPeriod.start} ~ {item.eventPeriod.end}
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell>{item.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination pagination={events.pagination} pathname="/event" searchParams={{}} />
    </div>
  )
}

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}
