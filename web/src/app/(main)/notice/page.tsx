import Link from 'next/link'

import { Pagination } from '~/components/pagination'
import { requireAuth } from '~/lib/auth'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { EmptyState } from '~/ui/empty-state'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/ui/table'

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(getFirstValue(resolvedSearchParams.page) ?? '1') || 1
  const client = await requireAuth()
  const notices = await client.notice.list({ page })

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">공지사항</h1>
        <p className="text-sm text-foreground-muted">센터 공지와 안내 사항을 확인하세요.</p>
      </div>

      {notices.items.length === 0 ? (
        <Card className="border border-border">
          <CardContent>
            <EmptyState message="등록된 공지사항이 없습니다." />
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Link className="font-medium text-foreground hover:text-primary" href={`/notice/${item.id}`}>
                    {item.title}
                  </Link>
                </TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>{item.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination pagination={notices.pagination} pathname="/notice" searchParams={{}} />
    </div>
  )
}

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}
