import type { ReactNode } from "react";

type MasonryGridProps = {
  children: ReactNode;
};

export function MasonryGrid({ children }: MasonryGridProps) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-6 [&>*]:break-inside-avoid">
      {children}
    </div>
  );
}
