import { db } from "@/lib/db";
import { techStack } from "@/db/schema";
import { TechForm } from "@/components/dashboard/tech-form";
import { deleteTech } from "@/actions/tech";
import { Button } from "@/components/ui/button";
import { desc } from "drizzle-orm";
import { Trash2, Layers } from "lucide-react";

export default async function TechPage() {
  const techs = await db.select().from(techStack).orderBy(desc(techStack.createdAt));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Tech Stack Manager</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Kolom Kiri: Form */}
        <div>
           <TechForm />
        </div>

        {/* Kolom Kanan: List Tech */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">My Stack</h3>
          {techs.length === 0 ? (
            <p className="text-muted-foreground">No tech stack added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {techs.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md">
                        {/* Placeholder Icon */}
                        <Layers className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  
                  <form action={deleteTech.bind(null, item.id)}>
                    <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}