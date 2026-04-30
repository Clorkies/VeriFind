import { GuestBanner } from "./components/GuestBanner";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <NavBar />
      <Hero />
      <GuestBanner />
    </div>
  );
}
