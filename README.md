# Adopta App

Adopta App es una aplicación web para gestionar adopciones responsables.

Permite:

- publicar animales en adopción
- cargar y administrar imágenes
- recibir y gestionar solicitudes
- editar publicaciones desde una vista separada de la gestión
- administrar el perfil del usuario
- consolidar el flujo entre publicadores y adoptantes

## Estado actual

El MVP actualmente cuenta con:

- Home pública con listado de animales
- Ficha pública de cada animal
- Registro e inicio de sesión con Supabase Auth
- Creación y lectura de perfil de usuario
- Edición básica de perfil
- Creación de publicaciones
- Gestión de publicaciones
- Separación entre:
  - gestión de publicación
  - edición de publicación
- Gestión de imágenes de cada publicación
- Gestión de solicitudes de adopción
- Historial de publicaciones adoptadas

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Arquitectura general

### Autenticación
La autenticación se resuelve con Supabase Auth.

### Perfil de usuario
Los datos del usuario se almacenan en:

- `public.usuarios`

Relación principal:

- `usuarios.auth_user_id -> auth.users.id`

### Tablas principales

- `usuarios`
- `animales_adopcion`
- `fotos_animales`
- `solicitudes_adopcion`
- `adopciones`
- `mascotas`
- `historial_salud`

## Flujo actual de publicaciones

### Gestión
Ruta principal:

- `/publicaciones/[id]`

Desde esa vista se resuelve:

- pausar / reactivar publicación
- eliminar publicación
- acceder a editar publicación
- gestionar solicitudes recibidas

### Edición
Ruta separada:

- `/publicaciones/[id]/editar`

Desde esa vista se resuelve:

- edición de datos principales
- descripción y estado de salud
- características del animal
- carga de imágenes
- cambio de portada
- eliminación de imágenes

## Variables de entorno

Crear un archivo `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=TU_URL_DE_SUPABASE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA

npm run dev
npm run build
npm run start
npm run lint


---

## 2) `app/protected/layout.tsx`

Pegá esto completo:

```tsx
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}







