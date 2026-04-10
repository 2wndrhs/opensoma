import { Pagination } from '~/components/pagination'
import { StatusBadge } from '~/components/status-badge'
import { requireAuth } from '~/lib/auth'
import { Card, CardContent } from '~/ui/card'
import { EmptyState } from '~/ui/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/ui/table'

export default async function MentoringHistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(getFirstValue(resolvedSearchParams.page) ?? '1') || 1
  const client = await requireAuth()
  const history = await client.mentoring.history({ page })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">신청 내역</h1>
        <p className="text-sm text-foreground-muted">내가 신청한 멘토링과 특강 이력을 확인하세요.</p>
      </div>

      {history.items.length === 0 ? (
        <Card className="border border-border">
          <CardContent>
            <EmptyState message="신청 내역이 없습니다." />
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>구분</TableHead>
              <TableHead>제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>강의날짜</TableHead>
              <TableHead>접수일</TableHead>
              <TableHead>접수상태</TableHead>
              <TableHead>개설승인</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.items.map((item) => (
              <TableRow key={`${item.id}-${item.title}`}>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>{item.sessionDate}</TableCell>
                <TableCell>{item.appliedAt}</TableCell>
                <TableCell>
                  <StatusBadge status={item.applicationStatus} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={item.approvalStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination pagination={history.pagination} pathname="/mentoring/history" searchParams={{}} />
    </div>
  )
}

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}
