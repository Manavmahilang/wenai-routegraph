export type TransportMode =
  | "FLIGHT"
  | "TRAIN"
  | "BUS"
  | "FERRY";

export type PriceTier =
  | "BUDGET"
  | "STANDARD"
  | "PREMIUM";

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;

  countryId: string;
  countryName?: string;

  regionId?: string;
  regionName?: string;

  latitude: number;
  longitude: number;

  description: string;

  image?: string;

  tags?: string[];

  highlights?: string[];

  timezone?: string;

  population?: number;
}

export interface Attraction {
  id: string;
  name: string;

  cityId: string;

  type: string;

  description: string;

  image?: string;

  rating?: number;

  durationMinutes?: number;

  bestTime?: string;

  tags?: string[];

  latitude?: number;

  longitude?: number;

  priceTier?: PriceTier;
}

export interface Route {
  id: string;

  fromId: string;
  toId: string;

  mode: TransportMode;

  durationMinutes: number;
  distanceKm: number;

  frequency: string;

  /*
   * Optional fields intentionally remain optional.
   *
   * This keeps the current seed data and current UI
   * completely backward compatible.
   */

  operator?: string;

  estimatedCost?: number;

  currency?: string;

  priceTier?: PriceTier;

  departureTime?: string;

  arrivalTime?: string;

  overnight?: boolean;

  reliability?: number;

  direct?: boolean;
}

export interface RouteSegment {
  from: City;
  to: City;

  mode: TransportMode;

  durationMinutes: number;
  distanceKm: number;

  frequency: string;

  operator?: string;

  estimatedCost?: number;

  currency?: string;

  priceTier?:
    | "BUDGET"
    | "STANDARD"
    | "PREMIUM";

  departureTime?: string;

  arrivalTime?: string;

  overnight?: boolean;

  reliability?: number;
}

export interface CityConnection {
  city: City;

  mode: TransportMode;

  durationMinutes: number;

  distanceKm: number;

  frequency: string;

  operator?: string;

  estimatedCost?: number;

  currency?: string;

  priceTier?: PriceTier;

  overnight?: boolean;

  reliability?: number;

  direct?: boolean;
}

export interface RouteSegment {
  from: City;

  to: City;

  mode: TransportMode;

  durationMinutes: number;

  distanceKm: number;

  frequency: string;

  operator?: string;

  estimatedCost?: number;

  currency?: string;

  priceTier?: PriceTier;

  departureTime?: string;

  arrivalTime?: string;

  overnight?: boolean;

  reliability?: number;
}

export interface RoutePath {
  // Existing fields
  cities: City[];

  totalDurationMinutes: number;

  totalDistanceKm: number;

  stops: number;

  modes: TransportMode[];

  // Advanced fields
  segments?: RouteSegment[];

  totalEstimatedCost?: number;

  currency?: string;

  direct?: boolean;

  score?: number;

  convenienceScore?: number;

  reliabilityScore?: number;
}

export interface GraphNode {
  id: string;

  label: string;

  type:
    | "city"
    | "country"
    | "attraction"
    | "region";

  image?: string;

  countryName?: string;

  description?: string;

  latitude?: number;

  longitude?: number;

  /*
   * Useful for advanced graph visualization.
   */
  metadata?: Record<string, unknown>;

  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;

  source: string;

  target: string;

  label: string;

  mode?: TransportMode;

  relationshipType?: string;

  durationMinutes?: number;

  distanceKm?: number;

  frequency?: string;

  operator?: string;

  estimatedCost?: number;

  currency?: string;

  reliability?: number;

  direct?: boolean;
}

export interface GraphResponse {
  nodes: GraphNode[];

  edges: GraphEdge[];

  centerId?: string;

  depth?: number;

  nodeCount?: number;

  edgeCount?: number;
}

export interface NetworkInsight {
  id: string;

  name: string;

  value: string | number;

  description: string;

  type:
    | "CONNECTIVITY"
    | "ACCESSIBILITY"
    | "TRANSPORT"
    | "DISTANCE"
    | "ATTRACTION";
}

export interface NetworkStats {
  cityId: string;

  cityName: string;

  directConnections: number;

  reachableCities: number;

  transportModes: number;

  attractions: number;

  countriesReachable: number;

  averageDurationMinutes: number;

  totalRouteDistanceKm: number;

  insights: NetworkInsight[];
}