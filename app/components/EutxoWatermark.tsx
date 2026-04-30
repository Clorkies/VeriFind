export function EutxoWatermark() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute left-[-12%] top-[-8%] h-[28rem] w-[28rem] rounded-full opacity-70 blur-[105px]"
        style={{
          background: "var(--color-accent-glow-strong)",
          animation: "blobFloat 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-16%] right-[-8%] h-[24rem] w-[24rem] rounded-full opacity-65 blur-[95px]"
        style={{
          background: "var(--color-accent-glow)",
          animation: "blobFloat 10s ease-in-out infinite",
          animationDelay: "0.8s",
        }}
      />
    </div>
  );
}
