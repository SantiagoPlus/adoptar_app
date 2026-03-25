"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  variant?: "default" | "menu";
  className?: string;
};

export function LogoutButton({
  variant = "default",
  className,
}: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={logout}
        className={cn(
          "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-white outline-none transition hover:bg-white/10 focus:bg-white/10",
          className,
        )}
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Cerrar sesión</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={logout}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10",
        className,
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      <span>Logout</span>
    </button>
  );
}
