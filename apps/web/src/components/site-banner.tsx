import { ArrowSquareOut, Warning } from '@phosphor-icons/react/dist/ssr'

import { GITHUB_REPOSITORY_URL } from '@/lib/seo'

export function SiteBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-warning/30 bg-warning-muted text-warning-foreground"
    >
      <div className="mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-1.5 text-center text-xs font-medium sm:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <Warning size={16} weight="fill" className="shrink-0" aria-hidden="true" />
          현재 세션 쿠키가 불안정하여 예기치 않게 로그아웃될 수 있습니다. 불편을 드려 죄송하며, 빠르게 복구 중입니다.
        </span>
        <a
          href={GITHUB_REPOSITORY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold underline underline-offset-2 transition-colors hover:text-warning focus-visible:ring-2 focus-visible:ring-warning focus-visible:ring-offset-1 focus-visible:ring-offset-warning-muted focus-visible:outline-none"
        >
          직접 기여하기
          <ArrowSquareOut size={14} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
