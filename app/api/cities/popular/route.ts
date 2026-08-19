import { NextResponse } from "next/server";
import { getPopularCities } from "@/lib/queries";

export async function GET() {
  try {
    const cities = await getPopularCities();

    return NextResponse.json(cities);
  } catch (error) {
    console.error("Popular cities failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load destinations.",
      },
      { status: 503 }
    );
  }
}