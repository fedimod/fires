const SERVER_URL = process.env.FIRES_SERVER_URL || "http://localhost:4444";

// XSD date format regex: yyyy-MM-dd'T'HH:mm:ss'Z'
// Matches the server's XSDDateFormat from app/utils/jsonld.ts
export const XSD_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

interface NodeInfoDiscovery {
  links: Array<{
    rel: string;
    href: string;
  }>;
}

interface NodeInfo {
  version: string;
  protocols: string[];
  metadata: {
    fires?: {
      labels?: string;
      datasets?: string;
    };
  };
}

/**
 * Fetches the NodeInfo discovery document from /.well-known/nodeinfo
 */
export async function getNodeInfoDiscovery(): Promise<NodeInfoDiscovery> {
  const url = new URL(".well-known/nodeinfo", getServerUrl()).href;
  const response = await fetch(url);
  return (await response.json()) as NodeInfoDiscovery;
}

/**
 * Fetches the NodeInfo 2.1 document by following the discovery link
 */
export async function getNodeInfo(): Promise<NodeInfo> {
  const discovery = await getNodeInfoDiscovery();

  const nodeinfo21Link = discovery.links.find(
    (link) => link.rel === "http://nodeinfo.diaspora.software/ns/schema/2.1",
  );

  if (!nodeinfo21Link) {
    throw new Error("NodeInfo 2.1 link not found in discovery document");
  }

  const response = await fetch(nodeinfo21Link.href);
  return (await response.json()) as NodeInfo;
}

/**
 * Gets the labels endpoint URL from the NodeInfo metadata
 */
export async function getLabelsEndpoint(): Promise<string | undefined> {
  const nodeinfo = await getNodeInfo();
  return nodeinfo.metadata?.fires?.labels;
}

/**
 * Gets the datasets endpoint URL from the NodeInfo metadata
 */
export async function getDatasetsEndpoint(): Promise<string | undefined> {
  const nodeinfo = await getNodeInfo();
  return nodeinfo.metadata?.fires?.datasets;
}

/**
 * Gets the server URL used for tests
 */
export function getServerUrl(): string {
  return SERVER_URL;
}
