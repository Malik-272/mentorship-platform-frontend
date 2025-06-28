import HeroSection from "../features/landing/HeroSection"
import StatsSection from "../features/landing/StatsSection"
import FeaturesSection from "../features/landing/FeaturesSection"
import HowItWorksSection from "../features/landing/HowItWorksSection"
import CommunitiesSection from "../features/landing/CommunitiesSection"
import TestimonialsSection from "../features/landing/TestimonialsSection"
import CTASection from "../features/landing/CTASection"

export default function LandingPage() {


  return (
    <div className="bg-white">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitiesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
