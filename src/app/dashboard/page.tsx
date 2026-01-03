import { auth } from "@/auth"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || "Admin"}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground">Total Visitors</div>
          <div className="text-2xl font-bold">0</div>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
           <div className="text-sm font-medium text-muted-foreground">Total Projects</div>
           <div className="text-2xl font-bold">0</div>
        </div>
      </div>
    </div>
  )
}