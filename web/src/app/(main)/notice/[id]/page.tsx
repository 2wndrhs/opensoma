import { notFound } from 'next/navigation'

import { HtmlContent } from '~/components/html-content'
import { requireAuth } from '~/lib/auth'
import { Card, CardContent, CardHeader } from '~/ui/card'
import { Separator } from '~/ui/separator'

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const noticeId = Number(id)

  if (Number.isNaN(noticeId)) {
    notFound()
  }

  const client = await requireAuth()
  const notice = await client.notice.get(noticeId)

  return (
    <Card className="border border-border">
      <CardHeader>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">{notice.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-foreground-muted">
            <span>작성자: {notice.author}</span>
            <span>등록일: {notice.createdAt}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <HtmlContent content={notice.content} />
      </CardContent>
    </Card>
  )
}
