"use client";

export default function ConfirmDeleteButton() {
  return (
    <button
      type="submit"
      onClick={(event) => {
        const confirmado = window.confirm(
          "¿Estás seguro que deseas eliminar la publicación?",
        );

        if (!confirmado) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
    >
      Eliminar publicación
    </button>
  );
}
