import type { ReactNode } from "react";
import PrivateNavbar from "@/components/app/private-navbar";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <PrivateNavbar />
      <main>{children}</main>
    </div>
  );
}
