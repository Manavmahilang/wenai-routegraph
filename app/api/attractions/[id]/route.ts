import { NextResponse } from "next/server";
import { getAttractionById } from "@/lib/queries";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Attraction ID is required" },
        { status: 400 }
      );
    }

    const attraction = await getAttractionById(id);

    if (!attraction) {
      return NextResponse.json(
        { error: "Attraction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attraction);
  } catch (error) {
    console.error("Attraction API failed:", error);

    return NextResponse.json(
      { error: "Unable to load attraction" },
      { status: 500 }
    );
  }
}