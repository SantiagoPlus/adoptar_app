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

export default async function MascotaLayout(props: LayoutProps) {
  const params = await props.params;
  const idMascota = params.id;

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

        {props.children}
      </section>
    </main>
  );
}
