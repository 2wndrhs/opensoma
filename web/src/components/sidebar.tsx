'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard', label: '대시보드' },
  { href: '/notice', label: '공지사항' },
  { href: '/mentoring', label: '멘토링 / 특강 게시판' },
  { href: '/room', label: '회의실 예약' },
  { href: '/team', label: '팀매칭' },
  { href: '/event', label: '행사 게시판' },
  { href: '/member', label: '회원정보' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 border-r border-border bg-surface">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-4 border-primary bg-primary-light text-primary'
                  : 'border-l-4 border-transparent text-foreground-muted hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
