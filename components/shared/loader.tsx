"use client";

import React from "react";
import { cn } from "@/lib/utils"; // shadcn utility — adjust if yours lives elsewhere

interface LoaderProps {
  message?: string;
  fullPage?: boolean;   // true = fill the viewport; false = fill parent container
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-4",
  lg: "h-14 w-14 border-4",
};

export default function Loader({
  message = "Loading…",
  fullPage = false,
  size = "md",
  className,
}: LoaderProps): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        fullPage ? "min-h-screen" : "min-h-[40vh] w-full",
        className,
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-slate-200 border-t-emerald-500",
          sizeMap[size],
        )}
      />
      <p className="text-sm text-slate-500">{message}</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}