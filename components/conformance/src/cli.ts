#!/usr/bin/env node

import { merge, object, conditional } from "@optique/core/constructs";
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
      const suites = input
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const invalidSuites = suites.filter((s) => !AVAILABLE_SUITES.includes(s));

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

const consoleParser = object({
  noColor: withDefault(option("--no-color"), false),
});

// Base options shared by all configurations
const parser = object({
  url: option("--url", url()),
  suites: optional(option("--suites", commaSeparatedSuites())),
  verbose: withDefault(option("--verbose"), false),
  reporter: conditional(
    option("--reporter", choice(["console", "junit", "html", "json"])),
    {
      console: consoleParser,
      junit: object({
        outputFile: option("--output-file", string()),
      }),
      html: object({
        outputFile: option("--output-file", string()),
      }),
      json: object({
        outputFile: option("--output-file", string()),
      }),
    },
    consoleParser,
  ),
});

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
      FIRES_SERVER_URL: options.url.href,
    },
  };

  const [reporter, reporterConfig] = options.reporter;

  if (reporter === "console" || typeof reporter === "undefined") {
    vitestConfig.color = !reporterConfig.noColor;
  }

  if (reporter === "html" || reporter === "json" || reporter === "junit") {
    // File-based reporter (junit/html/json)
    vitestConfig.reporters = [reporter];
    vitestConfig.outputFile = reporterConfig.outputFile;
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
