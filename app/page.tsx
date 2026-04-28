import { GuestBanner } from "./components/GuestBanner";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-void-900 via-void-900 to-void-800">
      <NavBar />
      <Hero />
      <GuestBanner />
    </div>
  );
}
