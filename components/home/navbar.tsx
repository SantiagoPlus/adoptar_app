import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export async function HomeNavbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return (
    <nav className="border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Adopta App
        </Link>

        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/perfil"
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Perfil
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Ingresar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
