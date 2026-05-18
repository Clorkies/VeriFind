"use client";

import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";

type QrScannerProps = {
  onScan: (text: string) => void;
  paused?: boolean;
};

export function QrScanner({ onScan, paused = false }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const lastScanRef = useRef<string | null>(null);

  const stop = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;
    const stream = videoRef.current?.srcObject;
    if (stream instanceof MediaStream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    stop();
    try {
      const reader = new BrowserQRCodeReader();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setActive(true);

      const controls = await reader.decodeFromVideoElement(
        video,
        (result, err) => {
          if (paused || !result) {
            if (err && err.name !== "NotFoundException") {
              // ignore continuous scan misses
            }
            return;
          }
          const text = result.getText();
          if (text === lastScanRef.current) return;
          lastScanRef.current = text;
          onScan(text);
        },
      );
      controlsRef.current = controls;
    } catch {
      setError(
        "Camera access failed. Use HTTPS, allow camera permission, or paste the sticker payload below.",
      );
    }
  }, [onScan, paused, stop]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-black/40">
        <video
          ref={videoRef}
          className="aspect-[4/3] w-full object-cover"
          muted
          playsInline
        />
        {!active ? (
          <div className="absolute inset-0 grid place-items-center bg-[var(--color-bg)]/60 p-4 text-center text-sm text-[var(--color-text-soft)]">
            Camera preview will appear here
          </div>
        ) : null}
        <div
          className="pointer-events-none absolute inset-8 rounded-lg border-2 border-dashed border-[var(--color-accent)]/70"
          aria-hidden
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {active ? (
          <button
            type="button"
            onClick={stop}
            className="btn-ghost rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Stop camera
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Start camera
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
