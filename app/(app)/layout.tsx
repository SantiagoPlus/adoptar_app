import type { ReactNode } from "react";
import { Suspense } from "react";
import PrivateNavbar from "@/components/app/private-navbar";

function PrivateNavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="text-xl font-semibold tracking-tight text-white">
          Adopta App
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-white/10 bg-white/5" />
          <div className="h-11 w-11 rounded-full border border-white/10 bg-white/5" />
        </div>
      </div>
    </header>
  );
}

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Suspense fallback={<PrivateNavbarFallback />}>
        <PrivateNavbar />
      </Suspense>
      <main>{children}</main>
    </div>
  );
}
