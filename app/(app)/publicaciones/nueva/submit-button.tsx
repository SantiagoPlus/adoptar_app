"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const [idempotencyKey, setIdempotencyKey] = useState("");

  useEffect(() => {
    setIdempotencyKey(window.crypto.randomUUID());
  }, []);

  const disabled = pending || !idempotencyKey;

  return (
    <>
      <input
        type="hidden"
        name="idempotency_key"
        value={idempotencyKey}
        readOnly
      />

      <button
        type="submit"
        disabled={disabled}
        className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creando publicación..." : "Crear publicación"}
      </button>
    </>
  );
}
