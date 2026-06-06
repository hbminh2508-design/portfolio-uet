"use client";

import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-[routeFadeIn_0.4s_ease-out_forwards] will-change-[opacity]">
      {children}
    </div>
  );
}