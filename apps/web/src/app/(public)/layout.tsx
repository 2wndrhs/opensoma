import { BookOpen, GithubLogo } from '@phosphor-icons/react/dist/ssr'

import { ThemeToggle } from '@/components/theme-toggle'
import Link from '@/ui/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-lg font-extrabold text-foreground">
              오픈소마
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/docs"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-muted hover:text-foreground"
              >
                <BookOpen size={16} />
                Docs
              </Link>
              <a
                href="https://github.com/opensoma/opensoma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-foreground-muted transition-colors hover:bg-muted hover:text-foreground"
              >
                <GithubLogo size={16} />
                GitHub
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              로그인
            </Link>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
