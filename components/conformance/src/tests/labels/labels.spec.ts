import { test, expect, describe } from 'vitest';
import { parse as parseBCP47 } from 'bcp-47';
import { getLabelsEndpoint } from '../../utils';

const EXPECTED_CONTEXT = [
  'https://www.w3.org/ns/activitystreams',
  'https://fires.fedimod.org/context/fires.jsonld',
];

/**
 * Validates that a language tag conforms to BCP-47
 */
function isValidBCP47(tag: string): boolean {
  const parsed = parseBCP47(tag);
  return parsed !== null && parsed.language !== undefined;
}

/**
 * Validates localized fields (nameMap, summaryMap, contentMap)
 * Each key must be a valid BCP-47 language tag
 */
function validateLocalizedField(field: any): void {
  if (field === undefined || field === null) {
    return;
  }

  expect(typeof field).toBe('object');
  expect(Array.isArray(field)).toBe(false);

  for (const [languageTag, value] of Object.entries(field)) {
    expect(isValidBCP47(languageTag)).toBe(true);
    expect(typeof value).toBe('string');
  }
}

/**
 * Validates that a label has either simple fields (name, summary, content)
 * or localized fields (nameMap, summaryMap, contentMap), but follows BCP-47 for localized ones
 */
function validateLabelFields(label: any): void {
  // name or nameMap must exist
  const hasName = 'name' in label;
  const hasNameMap = 'nameMap' in label;

  expect(hasName || hasNameMap).toBe(true);

  if (hasName) {
    expect(typeof label.name).toBe('string');
  }

  if (hasNameMap) {
    validateLocalizedField(label.nameMap);
  }

  // summary or summaryMap must exist
  const hasSummary = 'summary' in label;
  const hasSummaryMap = 'summaryMap' in label;

  expect(hasSummary || hasSummaryMap).toBe(true);

  if (hasSummary) {
    expect(typeof label.summary).toBe('string');
  }

  if (hasSummaryMap) {
    validateLocalizedField(label.summaryMap);
  }

  // content or contentMap is optional
  if ('content' in label) {
    expect(typeof label.content).toBe('string');
  }

  if ('contentMap' in label) {
    validateLocalizedField(label.contentMap);
  }
}

describe('Labels Collection', () => {
  test('labels endpoint returns valid JSON-LD', async () => {
    const labelsUrl = await getLabelsEndpoint();

    if (!labelsUrl) {
      throw new Error('Labels endpoint not found in NodeInfo metadata');
    }

    const response = await fetch(labelsUrl, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/ld+json');

    const data: any = await response.json();

    // Validate JSON-LD structure
    expect(data).toHaveProperty('@context');
    expect(data['@context']).toEqual(EXPECTED_CONTEXT);
  });

  test('labels collection has required fields', async () => {
    const labelsUrl = await getLabelsEndpoint();

    if (!labelsUrl) {
      throw new Error('Labels endpoint not found in NodeInfo metadata');
    }

    const response = await fetch(labelsUrl, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    const data: any = await response.json();

    // Collection should have these required fields
    expect(data.type).toBe('Collection');
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('totalItems');
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBe(true);
  });

  test('labels collection items have required structure and valid localization', async () => {
    const labelsUrl = await getLabelsEndpoint();

    if (!labelsUrl) {
      throw new Error('Labels endpoint not found in NodeInfo metadata');
    }

    const response = await fetch(labelsUrl, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    const data: any = await response.json();

    // If there are items, validate their structure
    if (data.items && data.items.length > 0) {
      for (const label of data.items) {
        expect(label.type).toBe('fires:Label');
        expect(label).toHaveProperty('id');

        // Validate fields can be either simple or localized with BCP-47 tags
        validateLabelFields(label);
      }
    }
  });
});

describe('Individual Labels', () => {
  test('individual label endpoint returns valid JSON-LD', async () => {
    const labelsUrl = await getLabelsEndpoint();

    if (!labelsUrl) {
      throw new Error('Labels endpoint not found in NodeInfo metadata');
    }

    // First get the collection to find a label
    const collectionResponse = await fetch(labelsUrl, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    const collection: any = await collectionResponse.json();

    // Skip test if no labels exist
    if (!collection.items || collection.items.length === 0) {
      console.log('No labels found, skipping individual label test');
      return;
    }

    const labelId = collection.items[0].id;

    // Fetch the individual label
    const response = await fetch(labelId, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/ld+json');

    const data: any = await response.json();

    // Validate JSON-LD structure
    expect(data).toHaveProperty('@context');
    expect(data['@context']).toEqual(EXPECTED_CONTEXT);
  });

  test('individual label has required fields and valid localization', async () => {
    const labelsUrl = await getLabelsEndpoint();

    if (!labelsUrl) {
      throw new Error('Labels endpoint not found in NodeInfo metadata');
    }

    // First get the collection to find a label
    const collectionResponse = await fetch(labelsUrl, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    const collection: any = await collectionResponse.json();

    // Skip test if no labels exist
    if (!collection.items || collection.items.length === 0) {
      console.log('No labels found, skipping individual label test');
      return;
    }

    const labelId = collection.items[0].id;

    // Fetch the individual label
    const response = await fetch(labelId, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    const data: any = await response.json();

    // Required fields per FIRES spec
    expect(data.type).toBe('fires:Label');
    expect(data).toHaveProperty('id');

    // Validate fields can be either simple or localized with BCP-47 tags
    validateLabelFields(data);
  });

  test('localized fields use valid BCP-47 language tags', async () => {
    const labelsUrl = await getLabelsEndpoint();

    if (!labelsUrl) {
      throw new Error('Labels endpoint not found in NodeInfo metadata');
    }

    // First get the collection to find labels
    const collectionResponse = await fetch(labelsUrl, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    const collection: any = await collectionResponse.json();

    // Skip test if no labels exist
    if (!collection.items || collection.items.length === 0) {
      console.log('No labels found, skipping localization test');
      return;
    }

    // Test all labels in the collection
    for (const labelRef of collection.items) {
      const response = await fetch(labelRef.id, {
        headers: {
          Accept: 'application/ld+json',
        },
      });

      const label: any = await response.json();

      // Check each localized field if it exists
      if ('nameMap' in label) {
        for (const tag of Object.keys(label.nameMap)) {
          expect(isValidBCP47(tag)).toBe(true);
        }
      }

      if ('summaryMap' in label) {
        for (const tag of Object.keys(label.summaryMap)) {
          expect(isValidBCP47(tag)).toBe(true);
        }
      }

      if ('contentMap' in label) {
        for (const tag of Object.keys(label.contentMap)) {
          expect(isValidBCP47(tag)).toBe(true);
        }
      }
    }
  });
});