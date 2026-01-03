import { FileDown, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animation/fade-in"

export function CtaSection() {
  return (
    <section className="container py-24 px-4">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground shadow-2xl sm:px-16 md:py-24">
          
          {/* Background Pattern (Optional) */}
          <div className="absolute top-0 left-0 -z-10 h-full w-full opacity-10">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="0" cy="0" r="40" fill="currentColor" />
              <circle cx="100" cy="100" r="40" fill="currentColor" />
            </svg>
          </div>

          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Interested in working together?
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            I&apos;m currently open for freelance projects and full-time opportunities. 
            Grab my resume or send me an email to discuss further.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="secondary" className="h-14 min-w-[160px] text-base font-semibold">
              <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <FileDown className="mr-2 h-5 w-5" />
                Download CV
              </Link>
            </Button>
            
            <Button asChild size="lg" variant="outline" className="h-14 min-w-[160px] bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10 text-base">
              <Link href="mailto:avin@example.com">
                <Mail className="mr-2 h-5 w-5" />
                Email Me
              </Link>
            </Button>
          </div>

        </div>
      </FadeIn>
    </section>
  )
}