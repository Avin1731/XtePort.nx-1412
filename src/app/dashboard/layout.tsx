import { auth } from "@/auth" 
import { DashboardClientLayout } from "@/components/layout/dashboard-client-layout"
import { getUnreadCounts } from "@/actions/message"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // 1. Ambil data notif (object)
  const counts = await getUnreadCounts();

  // 2. Oper ke Client Layout
  return (
    <DashboardClientLayout 
        user={session?.user} 
        counts={counts} 
    >
      {children}
    </DashboardClientLayout>
  )
}