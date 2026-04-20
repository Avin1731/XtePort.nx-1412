import Link from "next/link"
import { UserRound } from "lucide-react"

import { getPublicProfileData } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animation/fade-in"

function trimBio(bio: string | null | undefined) {
  if (!bio) return "";
  if (bio.length <= 260) return bio;
  return `${bio.slice(0, 257)}...`;
}

export async function AboutSection() {
  const data = await getPublicProfileData();

  const heading = data.profile?.headline || "More Than Just Code";
  const summary =
    trimBio(data.profile?.bio) ||
    "I believe in building software that is not only functional but also intuitive and delightful to use. Currently focused on mastering the Next.js ecosystem and exploring System Architecture.";

  return (
    <section className="bg-muted/30 py-20">
      <div className="container px-4">
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          {/* Kiri: Teks */}
          <div className="flex-1">
            <FadeIn direction="right">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                {heading}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {summary}
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
                {data.profile?.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.profile.avatarUrl}
                    alt="Profile preview"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/60">
                      <UserRound className="h-10 w-10" />
                      <span className="font-mono text-xs">Profile image coming soon</span>
                    </div>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}