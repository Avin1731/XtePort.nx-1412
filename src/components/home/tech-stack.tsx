import { FadeIn } from "@/components/animation/fade-in"

const technologies = [
  { name: "Next.js 15", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Framer Motion", category: "Animation" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Drizzle ORM", category: "Backend" },
]

export function TechStack() {
  return (
    <section className="container py-20 px-4">
      <FadeIn>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Current Tech Stack</h2>
          <p className="text-muted-foreground mt-2">
            Tools & technologies I use to build modern applications.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {technologies.map((tech, index) => (
          <FadeIn key={tech.name} delay={index * 0.1}>
            <div className="group relative overflow-hidden rounded-xl border bg-card p-4 text-center hover:border-primary/50 transition-colors">
              <div className="relative z-10">
                <p className="font-semibold">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.category}</p>
              </div>
              {/* Hover Effect */}
              <div className="absolute inset-0 -z-10 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}