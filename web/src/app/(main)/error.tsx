'use client'

import { Button } from '~/ui/button'
import { Card, CardContent, CardHeader } from '~/ui/card'

export default function MainError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-lg border border-border">
        <CardHeader>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">페이지를 불러오지 못했습니다.</h1>
            <p className="text-sm text-foreground-muted">잠시 후 다시 시도해주세요.</p>
          </div>
        </CardHeader>
        <CardContent>
          <Button onClick={reset}>다시 시도</Button>
        </CardContent>
      </Card>
    </div>
  )
}
