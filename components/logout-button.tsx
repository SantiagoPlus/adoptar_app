"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
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
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-white transition hover:bg-white/10",
          className,
        )}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    );
  }

  return (
    <Button onClick={logout} className={className}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
