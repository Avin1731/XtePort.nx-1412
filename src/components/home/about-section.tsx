import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animation/fade-in"

export function AboutSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container px-4">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          {/* Kiri: Teks */}
          <div className="flex-1">
            <FadeIn direction="right">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                More Than Just Code
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                I believe in building software that is not only functional but also intuitive and delightful to use. 
                Currently focused on mastering the <strong>Next.js ecosystem</strong> and exploring <strong>System Architecture</strong>.
              </p>
              <Button asChild variant="secondary">
                <Link href="/about">Read Full Story</Link>
              </Button>
            </FadeIn>
          </div>

          {/* Kanan: Visual Abstrak / Placeholder Gambar */}
          <div className="flex-1">
            <FadeIn direction="left" delay={0.2}>
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                  <span className="text-muted-foreground/50 font-mono text-sm">
                    [ Placeholder for your photo or abstract art ]
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}