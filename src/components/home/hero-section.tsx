import { ArrowRight, Github, Linkedin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animation/fade-in"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden py-10 text-center md:py-20">
      <div className="container relative z-10 flex flex-col items-center gap-6 px-4">
        
        {/* Badge / Label Kecil */}
        <FadeIn direction="down" delay={0.1}>
          <div className="rounded-full border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
            🚀 Available for new projects
          </div>
        </FadeIn>

        {/* Judul Besar */}
        <FadeIn delay={0.2}>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
            Hi, I&apos;m <span className="text-primary">Avin</span>
            <br />
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Fullstack Developer.
            </span>
          </h1>
        </FadeIn>

        {/* Deskripsi */}
        <FadeIn delay={0.4}>
          <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
            Building digital experiences with modern technologies. 
            Focused on performance, accessibility, and user-centric design.
          </p>
        </FadeIn>

        {/* Tombol CTA */}
        <FadeIn delay={0.6} className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-8 text-base">
            <Link href="/projects">
              View My Work <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
            <Link href="/about">About Me</Link>
          </Button>
        </FadeIn>

        {/* Social Links */}
        <FadeIn delay={0.8} className="mt-8 flex gap-4 text-muted-foreground">
          <Link href="https://github.com/Avin1731" target="_blank" className="hover:text-primary transition-colors">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="#" target="_blank" className="hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </FadeIn>

      </div>

      {/* Background Gradient (Hiasan) */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] bg-primary rounded-full pointer-events-none" />
    </section>
  )
}