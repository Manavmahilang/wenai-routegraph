import { NextRequest, NextResponse } from "next/server";
import { getCityGraph } from "@/lib/queries";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "City ID is required." },
        { status: 400 }
      );
    }

    const graph = await getCityGraph(id);

    return NextResponse.json(graph);
  } catch (error) {
    console.error("Graph API error:", error);

    return NextResponse.json(
      {
        error: "Unable to load the travel graph.",
      },
      { status: 503 }
    );
  }
}