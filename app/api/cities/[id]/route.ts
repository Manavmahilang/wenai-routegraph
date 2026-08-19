import { NextRequest, NextResponse } from "next/server";
import {
  getCityAttractions,
  getCityById,
  getCityConnections,
} from "@/lib/queries";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const [city, attractions, connections] =
      await Promise.all([
        getCityById(id),
        getCityAttractions(id),
        getCityConnections(id),
      ]);

    if (!city) {
      return NextResponse.json(
        { error: "Destination not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      city,
      attractions,
      connections,
    });
  } catch (error) {
    console.error("City details failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load destination.",
      },
      { status: 503 }
    );
  }
}