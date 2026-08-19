// -----------------------------------------------------------------------------
// NODE CONSTRAINTS
// -----------------------------------------------------------------------------

CREATE CONSTRAINT country_id IF NOT EXISTS
FOR (c:Country)
REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT region_id IF NOT EXISTS
FOR (r:Region)
REQUIRE r.id IS UNIQUE;

CREATE CONSTRAINT city_id IF NOT EXISTS
FOR (c:City)
REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT attraction_id IF NOT EXISTS
FOR (a:Attraction)
REQUIRE a.id IS UNIQUE;

CREATE CONSTRAINT transport_id IF NOT EXISTS
FOR (t:Transport)
REQUIRE t.id IS UNIQUE;


// -----------------------------------------------------------------------------
// NODE LOOKUP INDEXES
// -----------------------------------------------------------------------------

CREATE INDEX city_name IF NOT EXISTS
FOR (c:City)
ON (c.name);

CREATE INDEX country_name IF NOT EXISTS
FOR (c:Country)
ON (c.name);

CREATE INDEX attraction_name IF NOT EXISTS
FOR (a:Attraction)
ON (a.name);