import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "@/components/perfil/edit-profile-form";

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const displayValue =
    value && value.trim() !== "" ? value : "Sin completar";

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
        {label}
      </p>
      <p className="text-sm text-white/80">{displayValue}</p>
    </div>
  );
}

export async function PerfilPersonalContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: perfil, error } = await supabase
    .from("usuarios")
    .select("nombre, apellido, email, direccion, ciudad, foto_perfil")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error al cargar perfil:", error.message);
  }

  const nombreCompleto = [perfil?.nombre, perfil?.apellido]
    .filter(Boolean)
    .join(" ")
    .trim();

  const iniciales =
    nombreCompleto
      .split(" ")
      .map((parte) => parte[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <section className="mb-10">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Perfil personal</h2>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            Conectado
          </span>
        </div>
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="grid gap-4">
        <details className="group rounded-2xl border border-white/10 bg-white/5 p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10 text-lg font-semibold text-white/70">
                {perfil?.foto_perfil ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={perfil.foto_perfil}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{iniciales}</span>
                )}
              </div>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
                  Perfil
                </p>
                <h3 className="text-lg font-semibold">
                  {nombreCompleto || "Usuario"}
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  Estos son los datos personales actualmente guardados en tu
                  cuenta.
                </p>
              </div>
            </div>

            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 transition group-open:bg-white/10">
              Ver datos
            </span>
          </summary>

          <div className="mt-5 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-2">
            <ProfileField label="Nombre" value={perfil?.nombre} />
            <ProfileField label="Apellido" value={perfil?.apellido} />
            <ProfileField label="Correo" value={perfil?.email ?? user.email} />
            <ProfileField label="Dirección" value={perfil?.direccion} />
            <ProfileField label="Ciudad" value={perfil?.ciudad} />
            <ProfileField
              label="Foto de perfil"
              value={perfil?.foto_perfil ? "Cargada" : "Sin completar"}
            />
          </div>
        </details>

        <EditProfileForm
          authUserId={user.id}
          initialData={{
            nombre: perfil?.nombre,
            apellido: perfil?.apellido,
            direccion: perfil?.direccion,
            ciudad: perfil?.ciudad,
            foto_perfil: perfil?.foto_perfil,
          }}
        />
      </div>
    </section>
  );
}
