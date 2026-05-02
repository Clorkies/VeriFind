type SkeletonCardProps = {
  className?: string;
};

export function SkeletonCard({ className = "h-56" }: SkeletonCardProps) {
  return (
    <div
      className={`panel-card relative overflow-hidden rounded-2xl ${className}`}
    >
      <div className="shimmer h-[55%] w-full" />
      <div className="space-y-3 p-4">
        <div className="shimmer h-4 w-[60%] rounded-md" />
        <div className="shimmer h-3 w-[80%] rounded-md opacity-80" />
        <div className="shimmer mt-4 h-3 w-full rounded-md opacity-60" />
      </div>
    </div>
  );
}
