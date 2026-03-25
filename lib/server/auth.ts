import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser(options?: { loginNext?: string }) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    const next = options?.loginNext;
    if (next) {
      redirect(`/auth/login?next=${encodeURIComponent(next)}`);
    }
    redirect("/auth/login");
  }

  return {
    supabase,
    authUser: authData.user,
  };
}

export async function getCurrentUsuario(options?: {
  loginNext?: string;
  notFoundRedirect?: string;
}) {
  const { supabase, authUser } = await getAuthenticatedUser({
    loginNext: options?.loginNext,
  });

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select(
      "id_usuario, auth_user_id, nombre, apellido, email, foto_perfil",
    )
    .eq("auth_user_id", authUser.id)
    .single();

  if (usuarioError || !usuario) {
    if (options?.notFoundRedirect) {
      redirect(options.notFoundRedirect);
    }
    redirect("/?error=usuario_no_encontrado");
  }

  return {
    supabase,
    authUser,
    usuario,
  };
}
