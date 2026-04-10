import { Button } from '~/ui/button'
import { Card, CardContent, CardHeader } from '~/ui/card'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-lg border border-border text-center">
        <CardHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">404 NOT FOUND</p>
            <h1 className="text-2xl font-bold text-foreground">페이지를 찾을 수 없습니다.</h1>
            <p className="text-sm text-foreground-muted">요청하신 페이지가 없거나 이동되었을 수 있습니다.</p>
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <form action="/">
            <Button type="submit">홈으로 이동</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
