import { HeroSection } from "@/components/home/hero-section"
import { TechStack } from "@/components/home/tech-stack"
import { AboutSection } from "@/components/home/about-section"

export default function Home() {
  return (
    <div className="flex flex-col pb-0">
      <HeroSection />
      <TechStack />
      <AboutSection />
    </div>
  )
}