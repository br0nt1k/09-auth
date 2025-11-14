import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { Metadata } from "next";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import { notFound } from "next/navigation";

type NoteDetailsProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: NoteDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);

  if (!note) {
    return {};
  }

  return {
    title: `Деталі нотатки: ${note.title}`,
    description: `Деталі нотатки: ${note.title}`,
    openGraph: {
      title: `Нотатка - ${note.title}`,
      description: `Деталі нотатки: ${note.title}.`,
      url: `https://notehub.app/notes/${id}`,
      images: [
        { url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg" },
      ],
    },
  };
}

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const queryClient = new QueryClient();
  const { id } = await params;

  const initialNote = await fetchNoteByIdServer(id);

  if (!initialNote) {
    return notFound();
  }

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => initialNote,
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </div>
  );
};

export default NoteDetails;