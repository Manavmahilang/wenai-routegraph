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

/* -------------------------------------------------------------------------- */
/* CITY SEARCH                                                                */
/* -------------------------------------------------------------------------- */

export async function searchCities(
  search: string
): Promise<City[]> {
  const records = await executeQuery<CityRecord>(
    `
    MATCH (city:City)-[:LOCATED_IN]->(country:Country)

    WHERE
      toLower(city.name) CONTAINS toLower($search)
      OR
      toLower(country.name) CONTAINS toLower($search)

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

      tags: coalesce(city.tags, []),

      highlights: coalesce(city.highlights, []),

      timezone: city.timezone,

      population: city.population
    } AS city

    ORDER BY city.name

    LIMIT 20
    `,
    {
      search: search.trim(),
    }
  );

  return records.map(
    (record) => record.city
  );
}

/* -------------------------------------------------------------------------- */
/* CITY                                                                       */
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

      description: city.description,

      image: city.image,

      tags: coalesce(city.tags, []),

      highlights: coalesce(city.highlights, []),

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
/* ATTRACTIONS                                                                */
/* -------------------------------------------------------------------------- */

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

        description: attraction.description,

        image: attraction.image,

        rating: attraction.rating,

        durationMinutes:
          attraction.durationMinutes,

        bestTime: attraction.bestTime,

        tags: coalesce(
          attraction.tags,
          []
        ),

        latitude: attraction.latitude,

        longitude: attraction.longitude,

        priceTier: attraction.priceTier
      } AS attraction

      ORDER BY
        coalesce(attraction.rating, 0) DESC,
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
/* DIRECT CONNECTIONS                                                         */
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

        latitude: destination.latitude,
        longitude: destination.longitude,

        description: destination.description,

        image: destination.image,

        tags: coalesce(destination.tags, []),

        highlights:
          coalesce(destination.highlights, [])
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

      coalesce(route.overnight, false)
        AS overnight,

      route.reliability
        AS reliability,

      coalesce(route.direct, true)
        AS direct

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
/* POPULAR CITIES                                                             */
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
      count(route) AS connections

    RETURN {
      id: city.id,
      name: city.name,

      countryId: country.id,
      countryName: country.name,

      latitude: city.latitude,
      longitude: city.longitude,

      description: city.description,

      image: city.image,

      tags: coalesce(city.tags, []),

      highlights:
        coalesce(city.highlights, [])
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
/* ADVANCED ROUTE SEARCH                                                      */
/* -------------------------------------------------------------------------- */

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

export async function findRoutes(
  startCityId: string,
  destinationCityId: string
): Promise<RoutePath[]> {
  const records =
    await executeQuery<RouteQueryRecord>(
      `
      MATCH path =
        (start:City {id: $startCityId})
        -[:CONNECTED_BY*1..4]->
        (destination:City {
          id: $destinationCityId
        })

      WITH
        path,

        nodes(path) AS pathNodes,

        relationships(path)
          AS pathRelationships

      WITH
        path,
        pathNodes,
        pathRelationships,

        reduce(
          total = 0,
          rel IN pathRelationships |
          total +
            coalesce(
              rel.durationMinutes,
              0
            )
        ) AS totalDuration,

        reduce(
          total = 0,
          rel IN pathRelationships |
          total +
            coalesce(
              rel.distanceKm,
              0
            )
        ) AS totalDistance,

        reduce(
          total = 0,
          rel IN pathRelationships |
          total +
            coalesce(
              rel.estimatedCost,
              0
            )
        ) AS totalCost

      RETURN

        [
          i IN range(
            0,
            size(pathNodes) - 1
          ) |

          {
            id: pathNodes[i].id,

            name: pathNodes[i].name,

            countryId:
              head([
                (pathNodes[i])
                -[:LOCATED_IN]->
                (c:Country)
                | c.id
              ]),

            countryName:
              head([
                (pathNodes[i])
                -[:LOCATED_IN]->
                (c:Country)
                | c.name
              ]),

            regionId:
              head([
                (pathNodes[i])
                -[:IN_REGION]->
                (r:Region)
                | r.id
              ]),

            regionName:
              head([
                (pathNodes[i])
                -[:IN_REGION]->
                (r:Region)
                | r.name
              ]),

            latitude:
              pathNodes[i].latitude,

            longitude:
              pathNodes[i].longitude,

            description:
              pathNodes[i].description,

            image:
              pathNodes[i].image,

            tags:
              coalesce(
                pathNodes[i].tags,
                []
              ),

            highlights:
              coalesce(
                pathNodes[i].highlights,
                []
              )
          }
        ] AS cities,

        [

          i IN range(
            0,
            size(pathRelationships) - 1
          ) |

          {
            from: {
              id: pathNodes[i].id,
              name: pathNodes[i].name,

              latitude:
                pathNodes[i].latitude,

              longitude:
                pathNodes[i].longitude,

              description:
                pathNodes[i].description,

              image:
                pathNodes[i].image
            },

            to: {
              id: pathNodes[i + 1].id,
              name: pathNodes[i + 1].name,

              latitude:
                pathNodes[i + 1].latitude,

              longitude:
                pathNodes[i + 1].longitude,

              description:
                pathNodes[i + 1].description,

              image:
                pathNodes[i + 1].image
            },

            mode:
              pathRelationships[i].mode,

            durationMinutes:
              pathRelationships[i]
                .durationMinutes,

            distanceKm:
              pathRelationships[i]
                .distanceKm,

            frequency:
              pathRelationships[i]
                .frequency,

            operator:
              pathRelationships[i]
                .operator,

            estimatedCost:
              pathRelationships[i]
                .estimatedCost,

            currency:
              pathRelationships[i]
                .currency,

            priceTier:
              pathRelationships[i]
                .priceTier,

            departureTime:
              pathRelationships[i]
                .departureTime,

            arrivalTime:
              pathRelationships[i]
                .arrivalTime,

            overnight:
              coalesce(
                pathRelationships[i]
                  .overnight,
                false
              ),

            reliability:
              pathRelationships[i]
                .reliability
          }
        ] AS segments,

        totalDuration,

        totalDistance,

        totalCost,

        length(path) - 1
          AS stops,

        [
          rel IN pathRelationships |
          rel.mode
        ] AS modes,

        length(path) = 2
          AS direct

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

  return records.map((record) => ({
    cities: record.cities,

    totalDurationMinutes:
      record.totalDuration,

    totalDistanceKm:
      record.totalDistance,

    stops:
      record.stops,

    modes:
      record.modes as TransportMode[],

    segments:
      record.segments,

    totalEstimatedCost:
      record.totalCost || undefined,

    currency:
      record.segments?.find(
        (segment) => segment.currency
      )?.currency,

    direct:
      record.direct,

    /*
     * These can later be calculated from configurable
     * business rules without changing the API.
     */
    score:
      calculateRouteScore(record),

    convenienceScore:
      calculateConvenienceScore(record),

    reliabilityScore:
      calculateReliabilityScore(record),
  }));
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
    100 - route.stops * 20
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
      ?.map(
        (segment) =>
          segment.reliability
      )
      .filter(
        (
          value
        ): value is number =>
          typeof value === "number"
      ) ?? [];

  if (!values.length) {
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
/* REACHABILITY                                                               */
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
        (destination)-[:IN_REGION]->(region:Region)

      RETURN DISTINCT {
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
          destination.description,

        image:
          destination.image,

        tags:
          coalesce(destination.tags, []),

        highlights:
          coalesce(
            destination.highlights,
            []
          )
      } AS city

      ORDER BY city.name

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
/* ADVANCED CITY GRAPH                                                        */
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

      routes: Array<{
        id: string;
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
        collect(DISTINCT connected)
          AS connectedCities

      OPTIONAL MATCH
        (center)-[:LOCATED_IN]->
        (country:Country)

      OPTIONAL MATCH
        (center)-[:IN_REGION]->
        (region:Region)

      OPTIONAL MATCH
        (attraction:Attraction)
        -[:LOCATED_IN]->
        (center)

      RETURN

        {
          id: center.id,
          name: center.name,
          image: center.image,
          description: center.description,
          latitude: center.latitude,
          longitude: center.longitude,
          countryName: country.name
        } AS center,

        [

          city IN connectedCities

          WHERE city IS NOT NULL

          |

          {
            id: city.id,
            name: city.name,
            image: city.image,
            description: city.description,
            latitude: city.latitude,
            longitude: city.longitude,

            countryName:
              head([
                (city)-[:LOCATED_IN]->
                (c:Country)
                | c.name
              ])
          }

        ] AS cities,

        [

          a IN collect(
            DISTINCT attraction
          )

          WHERE a IS NOT NULL

          |

          {
            id: a.id,
            name: a.name,
            image: a.image,
            description: a.description
          }

        ] AS attractions,

        []

        AS routes
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
      centerId: cityId,
      depth: safeDepth,
      nodeCount: 0,
      edgeCount: 0,
    };
  }

  const nodes: GraphNode[] = [];

  const edges: GraphEdge[] = [];

  /*
   * Center city
   */
  nodes.push({
    id: record.center.id,
    label: record.center.name,
    type: "city",
    image: record.center.image,
    description: record.center.description,
    latitude: record.center.latitude,
    longitude: record.center.longitude,
    countryName: record.center.countryName,
  });

  /*
   * Connected cities
   */
  for (const city of record.cities) {
    nodes.push({
      id: city.id,
      label: city.name,
      type: "city",
      image: city.image,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
      countryName: city.countryName,
    });
  }

  /*
   * Attractions
   */
  for (const attraction of record.attractions) {
    nodes.push({
      id: attraction.id,
      label: attraction.name,
      type: "attraction",
      image: attraction.image,
      description:
        attraction.description,
    });

    edges.push({
      id:
        `${record.center.id}-attraction-${attraction.id}`,

      source: record.center.id,

      target: attraction.id,

      label: "ATTRACTION",

      relationshipType:
        "LOCATED_IN",
    });
  }

  /*
   * Fetch transport relationships separately.
   *
   * This prevents the multi-hop discovery query from
   * exploding relationship combinations.
   */
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

        center.id AS source,

        destination.id AS target,

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

  for (const route of routeRecords) {
    edges.push({
      id:
        `${route.source}-${route.target}-${route.mode}`,

      source: route.source,

      target: route.target,

      label: route.mode,

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
    nodes: uniqueNodes,

    edges: uniqueEdges,

    centerId: cityId,

    depth: safeDepth,

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

        count(route)
          AS routeCount,

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
        (city)<-[:LOCATED_IN]-
        (attraction:Attraction)

      WITH
        city,
        directConnections,
        modes,
        averageDuration,
        totalDistance,
        count(DISTINCT attraction)
          AS attractions

      RETURN {
        cityId: city.id,

        cityName: city.name,

        directConnections:
          directConnections,

        reachableCities:
          directConnections,

        transportModes:
          size(modes),

        attractions:
          attractions,

        countriesReachable: 0,

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

        insights: []
      } AS stats
      `,
      {
        cityId,
      }
    );

  if (!records[0]) {
    return null;
  }

  const stats = records[0];

  /*
   * Second graph-native query:
   * discover countries reachable from the city.
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
      id: "connections",
      name: "Direct connections",
      value: stats.directConnections,
      description:
        "Cities directly reachable from this destination.",
      type: "CONNECTIVITY",
    },
    {
      id: "modes",
      name: "Transport modes",
      value: stats.transportModes,
      description:
        "Different transportation modes available.",
      type: "TRANSPORT",
    },
    {
      id: "attractions",
      name: "Attractions",
      value: stats.attractions,
      description:
        "Attractions connected to this city.",
      type: "ATTRACTION",
    },
    {
      id: "countries",
      name: "Countries reachable",
      value: stats.countriesReachable,
      description:
        "Countries reachable within three graph hops.",
      type: "ACCESSIBILITY",
    },
  ];

  return stats;
}