import { Footer } from "./components/Footer";
import { GuestBanner } from "./components/GuestBanner";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { NavBar } from "./components/NavBar";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />
      <Hero />
      <HowItWorks />
      <Footer />
      <GuestBanner />
    </div>
  );
}
