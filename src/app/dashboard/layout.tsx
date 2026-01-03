import { AdminSidebar } from "@/components/layout/admin-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar (Fixed width) */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 border-r bg-background md:block">
        <AdminSidebar />
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 md:pl-64">
        <div className="container max-w-6xl p-8">
          {children}
        </div>
      </main>
    </div>
  )
}