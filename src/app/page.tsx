import {
  HeroSection,
  FeaturesSection,
  BenefitsSection,
  CTASection,
} from "@/modules/landing/components";
import { Footer, Header } from "@/modules/shared/components/layouts";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
