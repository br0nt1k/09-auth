import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";
import { fetchNotesServer } from "@/lib/api/serverApi";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0] === "all" ? "Усі нотатки" : slug[0];

  return {
    title: `Нотатки - ${category}`,
    description: `Нотатки, відфільтровані за категорією: ${category}.`,
    openGraph: {
      title: `Нотатки - ${category}`,
      description: `Нотатки, відфільтровані за категорією: ${category}.`,
      url: `https://notehub.app/notes/filter/${(await params).slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub styling card",
        },
      ],
    },
  };
}

const NotesByCategory = async ({ params }: Props) => {
  const { slug } = await params;
  const category = slug[0] === "all" ? undefined : slug[0];
  
  const queryClient = new QueryClient();

  const queryKey = ["notes", "", 1, category];

  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () => fetchNotesServer("", 1, category),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <NotesClient tag={category} />
      </HydrationBoundary>
    </div>
  );
};

export default NotesByCategory;