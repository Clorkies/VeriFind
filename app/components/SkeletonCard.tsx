type SkeletonCardProps = {
  className?: string;
};

export function SkeletonCard({ className = "h-56" }: SkeletonCardProps) {
  return (
    <div
      className={`glass overflow-hidden rounded-xl border-refraction/60 ${className}`}
    >
      <div className="gold-shimmer h-[52%] w-full opacity-80" />
      <div className="space-y-3 p-4">
        <div className="gold-shimmer h-4 w-[60%] rounded-md opacity-70" />
        <div className="gold-shimmer h-3 w-[80%] rounded-md opacity-50" />
        <div className="gold-shimmer mt-4 h-3 w-full rounded-md opacity-40" />
      </div>
    </div>
  );
}
