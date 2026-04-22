'use client'

import { usePathname } from 'next/navigation'

import { cn } from '@/lib/cn'
import type { SidebarSection } from '@/lib/docs'
import Link from '@/ui/link'

interface DocsSidebarProps {
  sections: SidebarSection[]
}

export function DocsSidebar({ sections }: DocsSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 md:block">
      <nav className="sticky top-22 max-h-[calc(100vh-5.5rem)] space-y-6 overflow-y-auto pb-8">
        {sections.map((section) => (
          <div key={section.title || '__root'}>
            {section.title && (
              <h3 className="mb-2 text-xs font-bold tracking-wider text-foreground-muted uppercase">{section.title}</h3>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-light text-primary'
                          : 'text-foreground-muted hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
