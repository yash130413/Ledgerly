import { Navbar } from "@/components/landing/navbar";
import { getSessionUser } from "@/lib/auth/session";
import { Hero } from "@/components/landing/hero";
import { LogoBar } from "@/components/landing/logo-bar";
import { WhyOverspend } from "@/components/landing/why-overspend";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ExampleRecommendations } from "@/components/landing/example-recommendations";
import { TrustSection } from "@/components/landing/trust-section";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default async function HomePage() {
  const user = await getSessionUser();

  return (
    <>
      <Navbar initialUser={user} />
      <main>
        <Hero />
        <LogoBar />
        <WhyOverspend />
        <Features />
        <HowItWorks />
        <ExampleRecommendations />
        <TrustSection />
        <Testimonials />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
