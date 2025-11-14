import { Note } from "@/types/note";
import { User } from "@/types/user";
import { api } from "./api"; 
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}


export const fetchNotesServer = async (
  search: string,
  page: number,
  categoryId?: string
): Promise<NotesResponse | null> => {
  const cookieStore = await cookies();
  const params: Record<string, string | number> = { page, perPage: 12 };
  if (search) params.search = search;
  if (categoryId && categoryId !== "All") params.tag = categoryId;

  try {
    const response = await api.get<NotesResponse>("/notes", {
      params,
      headers: { Cookie: cookieStore.toString() },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null; 
      }
      console.error("Axios error fetching notes (server):", error.response?.data);
    } else {
      console.error("Unexpected error fetching notes (server):", error);
    }
    return null;
  }
};

export const fetchNoteByIdServer = async (noteId: string): Promise<Note | null> => {
  const cookieStore = await cookies();
  try {
    const response = await api.get<Note>(`/notes/${noteId}`, {
      headers: { Cookie: cookieStore.toString() },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return null; 
    }
    if (isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }
      console.error("Axios error fetching note (server):", error.response?.data);
    } else {
      console.error("Unexpected error fetching note (server):", error);
    }
    return null;
  }
};


export const getMeServer = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  try {
    const response = await api.get<User>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            return null;
        }
        console.error("Axios error in getMeServer:", error.response?.data);
    } else {
        console.error("Unexpected error in getMeServer:", error);
    }
    return null;
  }
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  
  try {
    const apiRes = await api.get("/auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    
    return apiRes; 
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Failed to refresh session in middleware:", error.response?.data);
      return { headers: {}, status: error.response?.status };
    } else {
      console.error("Failed to refresh session in middleware:", error);
      return { headers: {}, status: 500 };
    }
  }
};