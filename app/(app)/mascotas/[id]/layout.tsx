import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MascotaSectionNav } from "./section-nav";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
};

function LayoutFallback() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 text-sm text-white/40">
            <ArrowLeft className="h-4 w-4" />
            Cargando mascota...
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Mascota
          </p>
          <div className="h-10 w-56 rounded bg-white/5" />
        </div>

        <div className="mb-6 rounded-xl bg-white/[0.03] p-1.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-lg bg-white/5" />
            <div className="h-12 rounded-lg bg-white/5" />
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#080808] p-6">
          <div className="h-40 rounded-[20px] bg-white/5" />
        </div>
      </section>
    </main>
  );
}

async function MascotaLayoutContent({
  children,
  params,
}: LayoutProps) {
  const { id: idMascota } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (!usuario) {
    redirect("/perfil");
  }

  const { data: mascota } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario, nombre")
    .eq("id_mascota", idMascota)
    .single();

  if (!mascota || mascota.id_usuario !== usuario.id_usuario) {
    redirect("/perfil");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-5">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi cuenta
          </Link>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
            Mascota
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {mascota.nombre}
          </h1>
        </div>

        <MascotaSectionNav idMascota={idMascota} />

        {children}
      </section>
    </main>
  );
}

export default function MascotaLayout(props: LayoutProps) {
  return (
    <Suspense fallback={<LayoutFallback />}>
      <MascotaLayoutContent {...props} />
    </Suspense>
  );
}
