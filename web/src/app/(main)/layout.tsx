import { Nav } from '~/components/nav'
import { Sidebar } from '~/components/sidebar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
