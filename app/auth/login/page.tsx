import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

function LoginFallback() {
  return (
    <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
      Cargando acceso...
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Suspense fallback={<LoginFallback />}>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
