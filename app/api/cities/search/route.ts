import { NextRequest, NextResponse } from "next/server";
import { searchCities } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const search =
      request.nextUrl.searchParams.get("q")?.trim() ?? "";

    if (!search) {
      return NextResponse.json([]);
    }

    const cities = await searchCities(search);

    return NextResponse.json(cities);
  } catch (error) {
    console.error("City search failed:", error);

    return NextResponse.json(
      {
        error: "Unable to search destinations.",
      },
      { status: 503 }
    );
  }
}