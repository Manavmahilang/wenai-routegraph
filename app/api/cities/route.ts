import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/cognodb";
import type { City } from "@/lib/types";

interface CityRecord {
  city: City;
}

export async function GET() {
  try {
    const records = await executeQuery<CityRecord>(
      `
      MATCH (city:City)-[:LOCATED_IN]->(country:Country)

      OPTIONAL MATCH (city)-[:IN_REGION]->(region:Region)

      RETURN {
        id: city.id,
        name: city.name,

        countryId: country.id,
        countryName: country.name,

        regionId: region.id,
        regionName: region.name,

        latitude: city.latitude,
        longitude: city.longitude,

        description: city.description,

        image: city.image,

        tags: city.tags,
        highlights: city.highlights
      } AS city

      ORDER BY city.name
      `
    );

    return NextResponse.json(
      records.map((record) => record.city)
    );
  } catch (error) {
    console.error(
      "Failed to load cities:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load destinations from CognoDB.",
      },
      { status: 503 }
    );
  }
}