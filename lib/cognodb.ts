import neo4j, { Driver } from "neo4j-driver";

declare global {
  // eslint-disable-next-line no-var
  var __routeGraphDriver: Driver | undefined;
}

function getConfig() {
  const uri = process.env.COGNODB_URI;
  const username = process.env.COGNODB_USERNAME;
  const password = process.env.COGNODB_PASSWORD;

  if (!uri || !username || !password) {
    throw new Error(
      "Missing COGNODB_URI, COGNODB_USERNAME or COGNODB_PASSWORD."
    );
  }

  return { uri, username, password };
}

export function getDriver(): Driver {
  if (global.__routeGraphDriver) {
    return global.__routeGraphDriver;
  }

  const { uri, username, password } = getConfig();

  const newDriver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password),
    {
      maxConnectionPoolSize: 20,
      connectionAcquisitionTimeout: 10000,
      connectionTimeout: 10000,
    }
  );

  if (process.env.NODE_ENV !== "production") {
    global.__routeGraphDriver = newDriver;
  }

  return newDriver;
}

export async function executeQuery<T = Record<string, unknown>>(
  query: string,
  parameters: Record<string, unknown> = {}
): Promise<T[]> {
  const driver = getDriver();

  const result = await driver.executeQuery(query, parameters);

  return result.records.map(
    (record) => record.toObject() as T
  );
}

export async function verifyDatabaseConnection() {
  try {
    await getDriver().verifyConnectivity();

    return {
      connected: true,
      error: null,
    };
  } catch (error) {
    console.error("CognoDB connection failed:", error);

    return {
      connected: false,
      error:
        error instanceof Error
          ? error.message
          : "Unable to connect to CognoDB",
    };
  }
}