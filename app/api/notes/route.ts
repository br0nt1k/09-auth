import { NextRequest, NextResponse } from "next/server";
import { api } from "../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const search = request.nextUrl.searchParams.get("search") ?? "";
  const page = Number(request.nextUrl.searchParams.get("page") ?? 1);
  const rawTag = request.nextUrl.searchParams.get("tag") ?? "";
  const tag = rawTag === "All" ? "" : rawTag;

  try {
    const apiRes = await api("/notes", {
      params: {
        ...(search !== "" && { search }),
        page,
        perPage: 12,
        ...(tag && { tag }),
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error fetching notes:", error.response?.data);
      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
    console.error("Unexpected error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    const body = await request.json();

    const apiRes = await api.post("/notes", body, {
      headers: {
        Cookie: cookieStore.toString(),
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Axios error creating note:", error.response?.data);
      return NextResponse.json(error.response?.data, {
        status: error.response?.status,
      });
    }
    console.error("Unexpected error creating note:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}