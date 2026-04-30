import { BoardContent } from "../components/BoardContent";
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
    <div className="relative min-h-screen">
      <NavBar />
      <BoardContent items={MOCK_ITEMS} showSkeleton={showSkeleton} />
      <GuestBanner />
    </div>
  );
}
