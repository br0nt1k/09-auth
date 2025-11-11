import NotePreviewClient from "./NotePreview.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteByIdServer } from "@/lib/api/serverApi";

type NotePreviewProps = {
  params: Promise<{ id: string }>;
};
const NotePreview = async ({ params }: NotePreviewProps) => {
  const queryClient = new QueryClient();
  const { id } = await params;
  const data = await fetchNoteByIdServer(id);

  await queryClient.prefetchQuery({
    queryKey: ["note", data.id],
    queryFn: () => fetchNoteByIdServer(data.id),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotePreviewClient />
      </HydrationBoundary>
    </div>
  );
};

export default NotePreview;
