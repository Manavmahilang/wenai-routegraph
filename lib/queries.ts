import { executeQuery } from "./cognodb";

import type {
  Attraction,
  City,
  CityConnection,
  GraphEdge,
  GraphNode,
  GraphResponse,
  NetworkStats,
  RoutePath,
  RouteSegment,
  TransportMode,
} from "./types";

/* -------------------------------------------------------------------------- */
/* INTERNAL RECORD TYPES                                                      */
/* -------------------------------------------------------------------------- */

interface CityRecord {
  city: City;
}

interface AttractionRecord {
  attraction: Attraction;
}

interface ConnectionRecord {
  destination: City;

  mode: string;

  durationMinutes: number;

  distanceKm: number;

  frequency: string;

  operator?: string;

  estimatedCost?: number;

  currency?: string;

  priceTier?: string;

  overnight?: boolean;

  reliability?: number;

  direct?: boolean;
}

interface RouteQueryRecord {
  cities: City[];

  segments: RouteSegment[];

  totalDuration: number;

  totalDistance: number;

  totalCost: number;

  stops: number;

  modes: string[];

  direct: boolean;
}

interface AttractionDetailRecord {
  attraction: Attraction;
  city: City;
}

/* -------------------------------------------------------------------------- */
/* CITY SEARCH                                                                */
/* -------------------------------------------------------------------------- */

export async function searchCities(
  search: string
): Promise<City[]> {
  const normalizedSearch = search.trim();

  if (!normalizedSearch) {
    return [];
  }

  const records = await executeQuery<CityRecord>(
    `
    MATCH
      (city:City)
      -[:LOCATED_IN]->
      (country:Country)

    WHERE
      toLower(city.name)
        CONTAINS toLower($search)

      OR

      toLower(country.name)
        CONTAINS toLower($search)

    OPTIONAL MATCH
      (city)-[:IN_REGION]->(region:Region)

    RETURN {
      id: city.id,
      name: city.name,

      countryId: country.id,
      countryName: country.name,

      regionId: region.id,
      regionName: region.name,

      latitude: city.latitude,
      longitude: city.longitude,

      description: coalesce(
        city.description,
        ""
      ),

      image: city.image,

      tags: coalesce(
        city.tags,
        []
      ),

      highlights: coalesce(
        city.highlights,
        []
      ),

      timezone: city.timezone,

      population: city.population
    } AS city

    ORDER BY city.name

    LIMIT 20
    `,
    {
      search: normalizedSearch,
    }
  );

  return records.map(
    (record) => record.city
  );
}

/* -------------------------------------------------------------------------- */
/* CITY DETAIL                                                                */
/* -------------------------------------------------------------------------- */

export async function getCityById(
  cityId: string
): Promise<City | null> {
  const records = await executeQuery<CityRecord>(
    `
    MATCH
      (city:City {id: $cityId})
      -[:LOCATED_IN]->
      (country:Country)

    OPTIONAL MATCH
      (city)-[:IN_REGION]->(region:Region)

    RETURN {
      id: city.id,
      name: city.name,

      countryId: country.id,
      countryName: country.name,

      regionId: region.id,
      regionName: region.name,

      latitude: city.latitude,
      longitude: city.longitude,

      description: coalesce(
        city.description,
        ""
      ),

      image: city.image,

      tags: coalesce(
        city.tags,
        []
      ),

      highlights: coalesce(
        city.highlights,
        []
      ),

      timezone: city.timezone,

      population: city.population
    } AS city

    LIMIT 1
    `,
    {
      cityId,
    }
  );

  return records[0]?.city ?? null;
}

/* -------------------------------------------------------------------------- */
/* CITY ATTRACTIONS                                                           */
/* -------------------------------------------------------------------------- */

export async function getAttractionById(
  attractionId: string
): Promise<{
  attraction: Attraction;
  city: City;
} | null> {
  const records =
    await executeQuery<AttractionDetailRecord>(
      `
      MATCH (attraction:Attraction {
        id: $attractionId
      })
      -[:LOCATED_IN]->
      (city:City)
      -[:LOCATED_IN]->
      (country:Country)

      OPTIONAL MATCH
        (city)-[:IN_REGION]->(region:Region)

      RETURN {
        id: attraction.id,
        name: attraction.name,
        cityId: city.id,
        type: attraction.type,
        description: coalesce(
          attraction.description,
          ""
        ),
        image: attraction.image,
        rating: attraction.rating,
        durationMinutes: attraction.durationMinutes,
        bestTime: attraction.bestTime,
        tags: attraction.tags
      } AS attraction,

      {
        id: city.id,
        name: city.name,
        countryId: country.id,
        countryName: country.name,
        regionId: region.id,
        regionName: region.name,
        latitude: city.latitude,
        longitude: city.longitude,
        description: coalesce(
          city.description,
          ""
        ),
        image: city.image,
        tags: city.tags,
        highlights: city.highlights
      } AS city

      LIMIT 1
      `,
      {
        attractionId,
      }
    );

  return records[0] ?? null;
}
 
export async function getCityAttractions(
  cityId: string
): Promise<Attraction[]> {
  const records =
    await executeQuery<AttractionRecord>(
      `
      MATCH
        (attraction:Attraction)
        -[:LOCATED_IN]->
        (city:City {id: $cityId})

      RETURN {
        id: attraction.id,

        name: attraction.name,

        cityId: city.id,

        type: attraction.type,

        description: coalesce(
          attraction.description,
          ""
        ),

        image: attraction.image,

        rating: attraction.rating,

        durationMinutes:
          attraction.durationMinutes,

        bestTime:
          attraction.bestTime,

        tags: coalesce(
          attraction.tags,
          []
        ),

        latitude:
          attraction.latitude,

        longitude:
          attraction.longitude,

        priceTier:
          attraction.priceTier
      } AS attraction

      ORDER BY
        coalesce(
          attraction.rating,
          0
        ) DESC,

        attraction.name
      `,
      {
        cityId,
      }
    );

  return records.map(
    (record) => record.attraction
  );
}

/* -------------------------------------------------------------------------- */
/* DIRECT CITY CONNECTIONS                                                    */
/* -------------------------------------------------------------------------- */

export async function getCityConnections(
  cityId: string
): Promise<CityConnection[]> {
  const records =
    await executeQuery<ConnectionRecord>(
      `
      MATCH
        (city:City {id: $cityId})
        -[route:CONNECTED_BY]-
        (destination:City)
        -[:LOCATED_IN]->
        (country:Country)

      OPTIONAL MATCH
        (destination)-[:IN_REGION]->(region:Region)

      RETURN {
        id: destination.id,
        name: destination.name,

        countryId: country.id,
        countryName: country.name,

        regionId: region.id,
        regionName: region.name,

        latitude:
          destination.latitude,

        longitude:
          destination.longitude,

        description:
          coalesce(
            destination.description,
            ""
          ),

        image:
          destination.image,

        tags:
          coalesce(
            destination.tags,
            []
          ),

        highlights:
          coalesce(
            destination.highlights,
            []
          )
      } AS destination,

      route.mode AS mode,

      route.durationMinutes
        AS durationMinutes,

      route.distanceKm
        AS distanceKm,

      route.frequency
        AS frequency,

      route.operator
        AS operator,

      route.estimatedCost
        AS estimatedCost,

      route.currency
        AS currency,

      route.priceTier
        AS priceTier,

      coalesce(
        route.overnight,
        false
      ) AS overnight,

      route.reliability
        AS reliability,

      coalesce(
        route.direct,
        true
      ) AS direct

      ORDER BY
        route.durationMinutes ASC,

        route.distanceKm ASC
      `,
      {
        cityId,
      }
    );

  return records.map((record) => ({
    city: record.destination,

    mode:
      record.mode as TransportMode,

    durationMinutes:
      record.durationMinutes,

    distanceKm:
      record.distanceKm,

    frequency:
      record.frequency,

    operator:
      record.operator,

    estimatedCost:
      record.estimatedCost,

    currency:
      record.currency,

    priceTier:
      record.priceTier as
        | "BUDGET"
        | "STANDARD"
        | "PREMIUM"
        | undefined,

    overnight:
      record.overnight,

    reliability:
      record.reliability,

    direct:
      record.direct,
  }));
}

/* -------------------------------------------------------------------------- */
/* POPULAR / DISCOVERY CITIES                                                 */
/* -------------------------------------------------------------------------- */

export async function getPopularCities(): Promise<City[]> {
  const records = await executeQuery<CityRecord>(
    `
    MATCH
      (city:City)
      -[:LOCATED_IN]->
      (country:Country)

    OPTIONAL MATCH
      (city)-[route:CONNECTED_BY]-()

    WITH
      city,
      country,

      count(route)
        AS connections

    RETURN {
      id: city.id,
      name: city.name,

      countryId: country.id,
      countryName: country.name,

      latitude: city.latitude,
      longitude: city.longitude,

      description:
        coalesce(
          city.description,
          ""
        ),

      image:
        city.image,

      tags:
        coalesce(
          city.tags,
          []
        ),

      highlights:
        coalesce(
          city.highlights,
          []
        )
    } AS city

    ORDER BY
      connections DESC,

      city.name

    LIMIT 20
    `
  );

  return records.map(
    (record) => record.city
  );
}

/* -------------------------------------------------------------------------- */
/* ADVANCED ROUTE FINDER                                                      */
/* -------------------------------------------------------------------------- */

export async function findRoutes(
  startCityId: string,
  destinationCityId: string
): Promise<RoutePath[]> {
  const records = await executeQuery<{
    pathNodes: Array<{
      properties: {
        id: string;
        name: string;
        latitude: number;
        longitude: number;
        description?: string;
      };
    }>;
    pathRelationships: Array<{
      properties: {
        mode?: string;
        durationMinutes?: number;
        distanceKm?: number;
      };
    }>;
    totalDuration: number;
    totalDistance: number;
    stops: number;
  }>(
    `
    MATCH path =
      (start:City {id: $startCityId})
      -[:CONNECTED_BY*1..4]->
      (destination:City {id: $destinationCityId})

    RETURN
      nodes(path) AS pathNodes,
      relationships(path) AS pathRelationships,

      reduce(
        total = 0,
        rel IN relationships(path) |
        total + coalesce(rel.durationMinutes, 0)
      ) AS totalDuration,

      reduce(
        total = 0,
        rel IN relationships(path) |
        total + coalesce(rel.distanceKm, 0)
      ) AS totalDistance,

      length(path) - 1 AS stops

    ORDER BY
      stops ASC,
      totalDuration ASC,
      totalDistance ASC

    LIMIT 20
    `,
    {
      startCityId,
      destinationCityId,
    }
  );

  return records.map((record) => {
    const cities: City[] = record.pathNodes.map(
      (node) => ({
        id: node.properties.id,
        name: node.properties.name,
        countryId: "",
        countryName: undefined,
        latitude: Number(
          node.properties.latitude
        ),
        longitude: Number(
          node.properties.longitude
        ),
        description:
          node.properties.description ?? "",
      })
    );

    const modes: RoutePath["modes"] =
      record.pathRelationships.map(
        (relationship) =>
          relationship.properties.mode as RoutePath["modes"][number]
      );

    return {
      cities,
      totalDurationMinutes:
        Number(record.totalDuration) || 0,
      totalDistanceKm:
        Number(record.totalDistance) || 0,
      stops: Number(record.stops) || 0,
      modes,
    };
  });
}

/* -------------------------------------------------------------------------- */
/* ROUTE SCORING                                                              */
/* -------------------------------------------------------------------------- */

function calculateRouteScore(
  route: RouteQueryRecord
): number {
  const durationScore = Math.max(
    0,
    100 -
      route.totalDuration / 30
  );

  const stopScore = Math.max(
    0,
    100 -
      route.stops * 20
  );

  const reliabilityScore =
    calculateReliabilityScore(route);

  return Math.round(
    durationScore * 0.45 +
      stopScore * 0.25 +
      reliabilityScore * 0.3
  );
}

function calculateConvenienceScore(
  route: RouteQueryRecord
): number {
  return Math.max(
    0,
    Math.round(
      100 -
        route.stops * 22 -
        route.totalDuration / 40
    )
  );
}

function calculateReliabilityScore(
  route: RouteQueryRecord
): number {
  const values =
    route.segments
      .map(
        (segment) =>
          segment.reliability
      )
      .filter(
        (
          value
        ): value is number =>
          typeof value === "number"
      );

  if (!values.length) {
    /*
     * Neutral fallback for legacy seed routes.
     */
    return 75;
  }

  return Math.round(
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / values.length
  );
}

/* -------------------------------------------------------------------------- */
/* REACHABLE DESTINATIONS                                                     */
/* -------------------------------------------------------------------------- */

export async function getReachableDestinations(
  cityId: string,
  maxHops = 2
): Promise<City[]> {
  const safeMaxHops = Math.min(
    Math.max(
      Math.floor(maxHops),
      1
    ),
    4
  );

  const records =
    await executeQuery<CityRecord>(
      `
      MATCH
        (:City {id: $cityId})
        -[:CONNECTED_BY*1..${safeMaxHops}]->
        (destination:City)
        -[:LOCATED_IN]->
        (country:Country)

      OPTIONAL MATCH
        (destination)-[:IN_REGION]->
        (region:Region)

      RETURN DISTINCT {

        id:
          destination.id,

        name:
          destination.name,

        countryId:
          country.id,

        countryName:
          country.name,

        regionId:
          region.id,

        regionName:
          region.name,

        latitude:
          destination.latitude,

        longitude:
          destination.longitude,

        description:
          coalesce(
            destination.description,
            ""
          ),

        image:
          destination.image,

        tags:
          coalesce(
            destination.tags,
            []
          ),

        highlights:
          coalesce(
            destination.highlights,
            []
          )
      } AS city

      ORDER BY
        city.name

      LIMIT 100
      `,
      {
        cityId,
      }
    );

  return records.map(
    (record) => record.city
  );
}

/* -------------------------------------------------------------------------- */
/* ADVANCED GRAPH                                                             */
/* -------------------------------------------------------------------------- */

export async function getCityGraph(
  cityId: string,
  depth = 1
): Promise<GraphResponse> {
  const safeDepth = Math.min(
    Math.max(
      Math.floor(depth),
      1
    ),
    3
  );

  /*
   * We deliberately keep the graph query bounded.
   *
   * This matters because the CognoDB free tier is small
   * and a graph visualization does not need an unlimited
   * traversal.
   */
  const records =
    await executeQuery<{
      center: {
        id: string;
        name: string;
        image?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
        countryName?: string;
      };

      cities: Array<{
        id: string;
        name: string;
        image?: string;
        description?: string;
        latitude?: number;
        longitude?: number;
        countryName?: string;
      }>;

      attractions: Array<{
        id: string;
        name: string;
        image?: string;
        description?: string;
      }>;
    }>(
      `
      MATCH
        (center:City {id: $cityId})

      OPTIONAL MATCH
        path =
          (center)
          -[:CONNECTED_BY*1..${safeDepth}]-
          (connected:City)

      WITH
        center,

        collect(
          DISTINCT connected
        ) AS connectedCities

      OPTIONAL MATCH
        (center)
        -[:LOCATED_IN]->
        (country:Country)

      OPTIONAL MATCH
        (attraction:Attraction)
        -[:LOCATED_IN]->
        (center)

      RETURN

        {
          id:
            center.id,

          name:
            center.name,

          image:
            center.image,

          description:
            center.description,

          latitude:
            center.latitude,

          longitude:
            center.longitude,

          countryName:
            country.name
        } AS center,

        [

          city IN connectedCities

          WHERE city IS NOT NULL

          |

          {
            id:
              city.id,

            name:
              city.name,

            image:
              city.image,

            description:
              city.description,

            latitude:
              city.latitude,

            longitude:
              city.longitude,

            countryName:
              head([
                (city)
                -[:LOCATED_IN]->
                (c:Country)
                | c.name
              ])
          }

        ] AS cities,

        [

          attraction IN collect(
            DISTINCT attraction
          )

          WHERE attraction IS NOT NULL

          |

          {
            id:
              attraction.id,

            name:
              attraction.name,

            image:
              attraction.image,

            description:
              attraction.description
          }

        ] AS attractions
      `,
      {
        cityId,
      }
    );

  const record = records[0];

  if (!record) {
    return {
      nodes: [],
      edges: [],

      centerId:
        cityId,

      depth:
        safeDepth,

      nodeCount: 0,

      edgeCount: 0,
    };
  }

  const nodes: GraphNode[] = [];

  const edges: GraphEdge[] = [];

  /* ------------------------------------------------------------------------ */
  /* CENTER                                                                   */
  /* ------------------------------------------------------------------------ */

  nodes.push({
    id:
      record.center.id,

    label:
      record.center.name,

    type:
      "city",

    image:
      record.center.image,

    description:
      record.center.description,

    latitude:
      record.center.latitude,

    longitude:
      record.center.longitude,

    countryName:
      record.center.countryName,
  });

  /* ------------------------------------------------------------------------ */
  /* CONNECTED CITIES                                                          */
  /* ------------------------------------------------------------------------ */

  for (const city of record.cities) {
    nodes.push({
      id:
        city.id,

      label:
        city.name,

      type:
        "city",

      image:
        city.image,

      description:
        city.description,

      latitude:
        city.latitude,

      longitude:
        city.longitude,

      countryName:
        city.countryName,
    });
  }

  /* ------------------------------------------------------------------------ */
  /* ATTRACTIONS                                                              */
  /* ------------------------------------------------------------------------ */

  for (
    const attraction of
      record.attractions
  ) {
    nodes.push({
      id:
        attraction.id,

      label:
        attraction.name,

      type:
        "attraction",

      image:
        attraction.image,

      description:
        attraction.description,
    });

    edges.push({
      id:
        `${cityId}-attraction-${attraction.id}`,

      source:
        cityId,

      target:
        attraction.id,

      label:
        "Attraction",

      relationshipType:
        "LOCATED_IN",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* TRANSPORT EDGES                                                          */
  /* ------------------------------------------------------------------------ */

  const routeRecords =
    await executeQuery<{
      source: string;

      target: string;

      mode: string;

      durationMinutes: number;

      distanceKm: number;

      frequency: string;

      operator?: string;

      estimatedCost?: number;

      currency?: string;

      reliability?: number;

      direct?: boolean;
    }>(
      `
      MATCH
        (center:City {id: $cityId})
        -[route:CONNECTED_BY]-
        (destination:City)

      RETURN

        center.id
          AS source,

        destination.id
          AS target,

        route.mode
          AS mode,

        route.durationMinutes
          AS durationMinutes,

        route.distanceKm
          AS distanceKm,

        route.frequency
          AS frequency,

        route.operator
          AS operator,

        route.estimatedCost
          AS estimatedCost,

        route.currency
          AS currency,

        route.reliability
          AS reliability,

        coalesce(
          route.direct,
          true
        ) AS direct
      `,
      {
        cityId,
      }
    );

  for (
    const route of routeRecords
  ) {
    edges.push({
      id:
        `${route.source}-${route.target}-${route.mode}`,

      source:
        route.source,

      target:
        route.target,

      label:
        route.mode,

      mode:
        route.mode as TransportMode,

      relationshipType:
        "CONNECTED_BY",

      durationMinutes:
        route.durationMinutes,

      distanceKm:
        route.distanceKm,

      frequency:
        route.frequency,

      operator:
        route.operator,

      estimatedCost:
        route.estimatedCost,

      currency:
        route.currency,

      reliability:
        route.reliability,

      direct:
        route.direct,
    });
  }

  const uniqueNodes =
    Array.from(
      new Map(
        nodes.map(
          (node) => [
            node.id,
            node,
          ]
        )
      ).values()
    );

  const uniqueEdges =
    Array.from(
      new Map(
        edges.map(
          (edge) => [
            edge.id,
            edge,
          ]
        )
      ).values()
    );

  return {
    nodes:
      uniqueNodes,

    edges:
      uniqueEdges,

    centerId:
      cityId,

    depth:
      safeDepth,

    nodeCount:
      uniqueNodes.length,

    edgeCount:
      uniqueEdges.length,
  };
}

/* -------------------------------------------------------------------------- */
/* NETWORK STATISTICS                                                         */
/* -------------------------------------------------------------------------- */

export async function getNetworkStats(
  cityId: string
): Promise<NetworkStats | null> {
  const records =
    await executeQuery<NetworkStats>(
      `
      MATCH
        (city:City {id: $cityId})

      OPTIONAL MATCH
        (city)-[route:CONNECTED_BY]-
        (connected:City)

      WITH
        city,

        count(DISTINCT connected)
          AS directConnections,

        collect(
          DISTINCT route.mode
        ) AS modes,

        avg(
          route.durationMinutes
        ) AS averageDuration,

        sum(
          route.distanceKm
        ) AS totalDistance

      OPTIONAL MATCH
        (attraction:Attraction)
        -[:LOCATED_IN]->
        (city)

      WITH
        city,

        directConnections,

        modes,

        averageDuration,

        totalDistance,

        count(
          DISTINCT attraction
        ) AS attractions

      RETURN {

        cityId:
          city.id,

        cityName:
          city.name,

        directConnections:
          directConnections,

        reachableCities:
          directConnections,

        transportModes:
          size(modes),

        attractions:
          attractions,

        countriesReachable:
          0,

        averageDurationMinutes:
          coalesce(
            averageDuration,
            0
          ),

        totalRouteDistanceKm:
          coalesce(
            totalDistance,
            0
          ),

        insights:
          []
      } AS stats
      `,
      {
        cityId,
      }
    );

  const stats =
    records[0];

  if (!stats) {
    return null;
  }

  /*
   * Graph-native multi-hop calculation.
   */
  const countryRecords =
    await executeQuery<{
      count: number;
    }>(
      `
      MATCH
        (:City {id: $cityId})
        -[:CONNECTED_BY*1..3]->
        (destination:City)
        -[:LOCATED_IN]->
        (country:Country)

      RETURN count(
        DISTINCT country.id
      ) AS count
      `,
      {
        cityId,
      }
    );

  stats.countriesReachable =
    countryRecords[0]?.count ?? 0;

  stats.insights = [
    {
      id:
        "connections",

      name:
        "Direct connections",

      value:
        stats.directConnections,

      description:
        "Cities directly reachable from this destination.",

      type:
        "CONNECTIVITY",
    },

    {
      id:
        "modes",

      name:
        "Transport modes",

      value:
        stats.transportModes,

      description:
        "Different transportation modes available.",

      type:
        "TRANSPORT",
    },

    {
      id:
        "attractions",

      name:
        "Attractions",

      value:
        stats.attractions,

      description:
        "Attractions connected to this city.",

      type:
        "ATTRACTION",
    },

    {
      id:
        "countries",

      name:
        "Countries reachable",

      value:
        stats.countriesReachable,

      description:
        "Countries reachable within three graph hops.",

      type:
        "ACCESSIBILITY",
    },
  ];

  return stats;
}