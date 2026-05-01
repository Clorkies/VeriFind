import { BoardContent } from "../components/BoardContent";
import { Footer } from "../components/Footer";
import { GuestBanner } from "../components/GuestBanner";
import { NavBar } from "../components/NavBar";
import { MOCK_ITEMS } from "@/lib/mockItems";

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
      <BoardContent items={MOCK_ITEMS} showSkeleton={showSkeleton} />
      <Footer />
      <GuestBanner />
    </div>
  );
}

