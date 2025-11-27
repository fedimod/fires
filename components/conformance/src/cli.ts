#!/usr/bin/env node

import { merge, object, or } from "@optique/core/constructs";
import { optional, withDefault } from "@optique/core/modifiers";
import { option } from "@optique/core/primitives";
import { choice, string, url } from "@optique/core/valueparser";
import type { ValueParser, ValueParserResult } from "@optique/core/valueparser";
import { message, values } from "@optique/core/message";
import { run } from "@optique/run";
import { startVitest } from "vitest/node";

const AVAILABLE_SUITES = ["labels", "datasets", "nodeinfo"];

// Custom value parser for comma-separated suite list
function commaSeparatedSuites(): ValueParser<string[]> {
  return {
    metavar: "SUITE[,SUITE...]",
    parse(input: string): ValueParserResult<string[]> {
      const suites = input.split(",").map(s => s.trim()).filter(s => s.length > 0);
      const invalidSuites = suites.filter(s => !AVAILABLE_SUITES.includes(s));

      if (invalidSuites.length > 0) {
        return {
          success: false,
          error: message`Invalid suite(s): ${values(invalidSuites)}. Available: ${values(AVAILABLE_SUITES)}`,
        };
      }

      return { success: true, value: suites };
    },
    format(suites: string[]): string {
      return suites.join(",");
    },
  };
}

// Base options shared by all configurations
const baseOptions = object({
  url: option("--url", url()),
  suites: optional(option("--suites", commaSeparatedSuites())),
  verbose: withDefault(option("--verbose"), false),
});

// File reporter configuration: requires both --reporter and --output-file
const fileReporterOptions = merge(
  baseOptions,
  object({
    reporter: option("--reporter", choice(["junit", "html", "json"])),
    outputFile: option("--output-file", string()),
  }),
);

// Console reporter configuration: --reporter optional, --output-file not present
const consoleReporterOptions = merge(
  baseOptions,
  object({
    reporter: withDefault(
      optional(option("--reporter", choice(["console"]))),
      "console" as const,
    ),
    noColor: withDefault(option("--no-color"), false),
  }),
);

// Try file reporter first (more specific), then console (more lenient)
const parser = or(fileReporterOptions, consoleReporterOptions);

async function main() {
  const pkg = require("../package.json");

  // Run the parser with optique
  const options = run(parser, {
    programName: "fires-conformance",
    help: "option",
    version: pkg.version,
  });

  // Convert suites to test directories if provided
  const testDirs = options.suites?.map((suite) => `src/tests/${suite}`);

  // Transform options for Vitest
  const vitestConfig: any = {
    run: true,
    mode: "test",
    env: {
      FIRES_SERVER_URL: options.url,
    },
  };

  // Configure reporter based on which parser matched
  if ("outputFile" in options) {
    // File-based reporter (junit/html/json)
    vitestConfig.reporters = [options.reporter];
    vitestConfig.outputFile = options.outputFile;
  } else {
    // Console reporter - check for color option
    if ("noColor" in options && options.noColor) {
      vitestConfig.color = false;
    }
  }

  // Configure logging level
  if (options.verbose) {
    vitestConfig.logLevel = "info";
  }

  // Run Vitest programmatically
  const vitest = await startVitest("test", testDirs || [], vitestConfig);

  if (!vitest) {
    console.error("Failed to start Vitest");
    process.exit(1);
  }

  // Exit with appropriate code based on test results
  const hasFailures =
    vitest.state.getUnhandledErrors().length > 0 ||
    vitest.state.getCountOfFailedTests() > 0;

  await vitest.close();
  process.exit(hasFailures ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
