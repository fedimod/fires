import { test, expect, describe } from "vitest";
import {
  getServerUrl,
  getNodeInfo,
  getLabelsEndpoint,
  getDatasetsEndpoint,
} from "../../utils";

describe("NodeInfo", () => {
  test("GET /.well-known/nodeinfo returns JSON", async () => {
    const response = await fetch(
      new URL(".well-known/nodeinfo", getServerUrl()).href,
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
  });

  test("nodeinfo 2.1 endpoint has version 2.1", async () => {
    const nodeinfo = await getNodeInfo();

    expect(nodeinfo.version).toBe("2.1");
  });

  test('protocols array contains "fires"', async () => {
    const nodeinfo = await getNodeInfo();

    expect(Array.isArray(nodeinfo.protocols)).toBe(true);
    expect(nodeinfo.protocols).toContain("fires");
  });

  test("metadata.fires is an object", async () => {
    const nodeinfo = await getNodeInfo();

    expect(typeof nodeinfo.metadata.fires).toBe("object");
  });

  test("metadata.fires.labels is a well-formed IRI (optional)", async () => {
    const labels = await getLabelsEndpoint();

    if (labels !== undefined) {
      expect(typeof labels).toBe("string");
      expect(URL.canParse(labels)).toBe(true);
    }
  });

  test("metadata.fires.datasets is a well-formed IRI (optional)", async () => {
    const datasets = await getDatasetsEndpoint();

    if (datasets !== undefined) {
      expect(typeof datasets).toBe("string");
      expect(URL.canParse(datasets)).toBe(true);
    }
  });
});
