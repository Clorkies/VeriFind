import { BoardContent } from "../components/BoardContent";
import { Footer } from "../components/Footer";
import { GuestBanner } from "../components/GuestBanner";
import { NavBar } from "../components/NavBar";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ loading?: string }>;
}) {
  const sp = await searchParams;
  const showSkeleton = sp.loading === "1";

  return (
    <div className="relative flex min-h-screen flex-col">
      <NavBar />
      <BoardContent showSkeleton={showSkeleton} />
      <Footer />
      <GuestBanner />
    </div>
  );
}

