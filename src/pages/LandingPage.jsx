import HeroSection from "../features/landing/HeroSection"
import StatsSection from "../features/landing/StatsSection"
import FeaturesSection from "../features/landing/FeaturesSection"
import HowItWorksSection from "../features/landing/HowItWorksSection"
import CommunitiesSection from "../features/landing/CommunitiesSection"
import TestimonialsSection from "../features/landing/TestimonialsSection"
import CTASection from "../features/landing/CTASection"

export default function LandingPage() {


  return (
    <div className="bg-white dark:bg-gray-800">
      <HeroSection />
      <StatsSection />
      <section id="features">
        <FeaturesSection />
      </section>

      <section id="how-it-works">
        <HowItWorksSection />
      </section>

      <section id="communities">
        <CommunitiesSection />
      </section>

      <section id="testimonials">
        <TestimonialsSection />
      </section>
      <CTASection />
    </div>
  )
}
