import { Suspense } from "react";
import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<SearchParams>;
};

function buildQueryString(searchParams: SearchParams) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      query.set(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    }
  }

  const result = query.toString();
  return result ? `?${result}` : "";
}

async function RedirectToLibreta({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const queryString = buildQueryString(resolvedSearchParams);

  redirect(`/mascotas/${id}/libreta${queryString}`);
  return null;
}

export default function MascotaPage(props: PageProps) {
  return (
    <Suspense fallback={null}>
      <RedirectToLibreta {...props} />
    </Suspense>
  );
}
