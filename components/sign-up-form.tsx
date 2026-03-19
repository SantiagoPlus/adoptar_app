"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const router = useRouter();
  const supabase = createClient();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const direccionLimpia = direccion.trim();
    const emailLimpio = email.trim().toLowerCase();

    if (!nombreLimpio || !apellidoLimpio || !direccionLimpia || !emailLimpio) {
      setError("Completá todos los campos.");
      return;
    }

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: emailLimpio,
        password,
        options: {
          data: {
            nombre: nombreLimpio,
            apellido: apellidoLimpio,
            direccion: direccionLimpia,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      router.push("/auth/sign-up-success");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error al crear la cuenta.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="mb-2 block text-sm text-white/70">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div>
        <label htmlFor="apellido" className="mb-2 block text-sm text-white/70">
          Apellido
        </label>
        <input
          id="apellido"
          type="text"
          value={apellido}
          onChange={(event) => setApellido(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
          placeholder="Tu apellido"
          required
        />
      </div>

      <div>
        <label htmlFor="direccion" className="mb-2 block text-sm text-white/70">
          Dirección
        </label>
        <input
          id="direccion"
          type="text"
          value={direccion}
          onChange={(event) => setDireccion(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
          placeholder="Tu dirección"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-white/70">
          Mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-white/70">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
          placeholder="********"
          required
        />
      </div>

      <div>
        <label
          htmlFor="repeatPassword"
          className="mb-2 block text-sm text-white/70"
        >
          Repetir contraseña
        </label>
        <input
          id="repeatPassword"
          type="password"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/30"
          placeholder="********"
          required
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="text-sm text-white/60">
        ¿Ya tenés cuenta?{" "}
        <Link href="/auth/login" className="text-white transition hover:opacity-80">
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
