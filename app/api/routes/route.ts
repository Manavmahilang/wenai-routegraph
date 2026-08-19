import { NextRequest, NextResponse } from "next/server";
import { findRoutes } from "@/lib/queries";

export async function GET(request: NextRequest) {
  try {
    const start =
      request.nextUrl.searchParams.get("from");

    const destination =
      request.nextUrl.searchParams.get("to");

    if (!start || !destination) {
      return NextResponse.json(
        {
          error: "Both from and to destinations are required.",
        },
        { status: 400 }
      );
    }

    if (start === destination) {
      return NextResponse.json(
        {
          error:
            "Starting and destination cities must be different.",
        },
        { status: 400 }
      );
    }

    const routes = await findRoutes(start, destination);

    return NextResponse.json(routes);
  } catch (error) {
    console.error("Route search failed:", error);

    return NextResponse.json(
      {
        error: "Unable to calculate routes.",
      },
      { status: 503 }
    );
  }
}