import { getDriver } from "@/lib/cognodb";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const driver = getDriver();

    const result = await driver.executeQuery(
      `
      RETURN
        "RouteGraph" AS application,
        "CognoDB" AS database,
        1 AS status
      `,
      {}
    );

    const record = result.records[0];

    return NextResponse.json({
      success: true,
      application: record.get("application"),
      database: record.get("database"),
      status: record.get("status"),
    });
  } catch (error) {
    console.error("CognoDB health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "CognoDB is unreachable",
      },
      { status: 503 }
    );
  }
}