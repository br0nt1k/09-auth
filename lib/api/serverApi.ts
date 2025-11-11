import { cookies } from "next/headers";
import { nextServer } from "./api";
import { NotesResponse } from "./clientApi";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  // Повертаємо повний респонс, щоб middleware мав доступ до нових cookie
  return res;
};

export const fetchUserProfile = async () => {
  const cookieStore = await cookies();
  const response = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNotesServer = async (
  search: string,
  page: number,
  categoryId?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page };
  if (search) {
    params.search = search;
  }

  if (categoryId && categoryId !== "All") {
    params.tag = categoryId;
  }

  const cookieStore = await cookies();

  const response = await nextServer.get<NotesResponse>("/notes", {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getMeServer = async () => {
  const cookieStore = await cookies();

  const response = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteByIdServer = async (noteId: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await nextServer.get<Note>(`/notes/${noteId}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};
