import { test, expect, describe } from "vitest";
import { getDatasetsEndpoint, XSD_DATE_REGEX } from "../../utils";

const EXPECTED_CONTEXT = [
  "https://www.w3.org/ns/activitystreams",
  "https://fires.fedimod.org/context/fires.jsonld",
];

/**
 * Validates that a dataset has all required fields
 */
function validateDatasetFields(dataset: any): void {
  // Required fields per FIRES spec
  expect(dataset.type).toBe("Dataset");
  expect(dataset).toHaveProperty("id");
  expect(typeof dataset.id).toBe("string");
  expect(URL.canParse(dataset.id)).toBe(true);

  // name is required
  expect(dataset).toHaveProperty("name");
  expect(typeof dataset.name).toBe("string");

  // url is optional
  if ("url" in dataset) {
    expect(typeof dataset.url).toBe("string");
    expect(URL.canParse(dataset.url)).toBe(true);
  }

  // published is required
  expect(dataset).toHaveProperty("published");
  expect(typeof dataset.published).toBe("string");
  expect(XSD_DATE_REGEX.test(dataset.published)).toBe(true);

  // endpoints are required
  expect(dataset).toHaveProperty("endpoints");
  expect(typeof dataset.endpoints).toBe("object");
  expect(dataset.endpoints).toHaveProperty("changes");
  expect(typeof dataset.endpoints.changes).toBe("string");
  expect(URL.canParse(dataset.endpoints.changes)).toBe(true);
  expect(dataset.endpoints).toHaveProperty("snapshot");
  expect(typeof dataset.endpoints.snapshot).toBe("string");
  expect(URL.canParse(dataset.endpoints.snapshot)).toBe(true);

  // Optional fields - validate if present
  if ("summary" in dataset) {
    expect(typeof dataset.summary).toBe("string");
  }

  if ("content" in dataset) {
    expect(typeof dataset.content).toBe("string");
  }

  if ("updated" in dataset) {
    expect(typeof dataset.updated).toBe("string");
    expect(XSD_DATE_REGEX.test(dataset.updated)).toBe(true);
  }
}

describe("Datasets Collection", () => {
  test("datasets endpoint returns valid JSON-LD", async () => {
    const datasetsUrl = await getDatasetsEndpoint();

    if (!datasetsUrl) {
      throw new Error("Datasets endpoint not found in NodeInfo metadata");
    }

    const response = await fetch(datasetsUrl, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    expect(response.status).toBe(200);

    // Can have further specifiers *after*, per discussion with @ThisIsMissEm.
    expect(
      response.headers.get("content-type")?.startsWith("application/ld+json"),
    ).toBe(true);

    const data: any = await response.json();

    // Validate JSON-LD structure
    expect(data).toHaveProperty("@context");
    expect(data["@context"]).toEqual(EXPECTED_CONTEXT);
  });

  test("datasets collection has required fields", async () => {
    const datasetsUrl = await getDatasetsEndpoint();

    if (!datasetsUrl) {
      throw new Error("Datasets endpoint not found in NodeInfo metadata");
    }

    const response = await fetch(datasetsUrl, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const data: any = await response.json();

    // Collection should have these required fields
    // Both Collection and OrderedCollection are technically interchangeable
    expect(["Collection", "OrderedCollection"]).toContain(data.type);
    expect(data).toHaveProperty("totalItems");
    expect(typeof data.totalItems).toBe("number");
    expect(Number.isInteger(data.totalItems)).toBe(true);
    expect(data.totalItems).toBeGreaterThanOrEqual(0);

    // TODO: support `orderedItems` in case of `OrderedCollection`.
    // This probably needs a small rethink.
    expect(data).toHaveProperty("items");
    expect(Array.isArray(data.items)).toBe(true);
  });

  test("datasets collection items have required structure", async () => {
    const datasetsUrl = await getDatasetsEndpoint();

    if (!datasetsUrl) {
      throw new Error("Datasets endpoint not found in NodeInfo metadata");
    }

    const response = await fetch(datasetsUrl, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const data: any = await response.json();

    // If there are items, validate their structure
    if (data.items && data.items.length > 0) {
      for (const dataset of data.items) {
        validateDatasetFields(dataset);
      }
    }
  });
});

describe("Individual Datasets", () => {
  test("individual dataset endpoint returns valid JSON-LD", async () => {
    const datasetsUrl = await getDatasetsEndpoint();

    if (!datasetsUrl) {
      throw new Error("Datasets endpoint not found in NodeInfo metadata");
    }

    // First get the collection to find a dataset
    const collectionResponse = await fetch(datasetsUrl, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const collection: any = await collectionResponse.json();

    // Skip test if no datasets exist
    if (!collection.items || collection.items.length === 0) {
      console.log("No datasets found, skipping individual dataset test");
      return;
    }

    const datasetId = collection.items[0].id;

    // Fetch the individual dataset
    const response = await fetch(datasetId, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain(
      "application/ld+json",
    );

    const data: any = await response.json();

    // Validate JSON-LD structure
    expect(data).toHaveProperty("@context");
    expect(data["@context"]).toEqual(EXPECTED_CONTEXT);
  });

  test("individual dataset has required fields", async () => {
    const datasetsUrl = await getDatasetsEndpoint();

    if (!datasetsUrl) {
      throw new Error("Datasets endpoint not found in NodeInfo metadata");
    }

    // First get the collection to find a dataset
    const collectionResponse = await fetch(datasetsUrl, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const collection: any = await collectionResponse.json();

    // Skip test if no datasets exist
    if (!collection.items || collection.items.length === 0) {
      console.log("No datasets found, skipping individual dataset test");
      return;
    }

    const datasetId = collection.items[0].id;

    // Fetch the individual dataset
    const response = await fetch(datasetId, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const data: any = await response.json();

    // Validate all required fields
    validateDatasetFields(data);
  });

  test("dataset endpoints are accessible", async () => {
    const datasetsUrl = await getDatasetsEndpoint();

    if (!datasetsUrl) {
      throw new Error("Datasets endpoint not found in NodeInfo metadata");
    }

    // First get the collection to find a dataset
    const collectionResponse = await fetch(datasetsUrl, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const collection: any = await collectionResponse.json();

    // Skip test if no datasets exist
    if (!collection.items || collection.items.length === 0) {
      console.log("No datasets found, skipping endpoints test");
      return;
    }

    const datasetId = collection.items[0].id;

    // Fetch the individual dataset
    const datasetResponse = await fetch(datasetId, {
      headers: {
        Accept: "application/ld+json",
      },
    });

    const dataset: any = await datasetResponse.json();

    // Verify changes endpoint is accessible
    const changesResponse = await fetch(dataset.endpoints.changes, {
      headers: {
        Accept: "application/ld+json",
      },
    });
    expect(changesResponse.status).toBe(200);
    expect(
      changesResponse.headers
        .get("content-type")
        ?.startsWith("application/ld+json"),
    ).toBe(true);

    // Verify snapshot endpoint is accessible
    const snapshotResponse = await fetch(dataset.endpoints.snapshot, {
      headers: {
        Accept: "application/ld+json",
      },
    });
    expect(snapshotResponse.status).toBe(200);
    expect(
      snapshotResponse.headers
        .get("content-type")
        ?.startsWith("application/ld+json"),
    ).toBe(true);
  });
});
