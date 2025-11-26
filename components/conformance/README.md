# FIRES Conformance Test Suite

[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

A comprehensive conformance test suite for validating FIRES protocol implementations. This tool helps ensure that FIRES servers correctly implement the protocol for exchanging moderation data.

## What is FIRES?

**FIRES** stands for **F**ediverse **I**ntelligence **R**eplication **E**ndpoint **S**erver. It's a protocol that allows Fediverse instances to exchange lists of recommended actions to take against instances sharing nonconsensual imagery, abuse, or bigotry.

This conformance suite validates that server implementations correctly follow the [FIRES Protocol Specification](https://fires.fedimod.org/reference/protocol/).

## Features

- Protocol-level validation of FIRES server implementations
- Support for both local and remote server testing
- Multiple output formats for CI/CD integration
- Docker-based distribution for platform independence
- Selective test execution by category
- Built on Vitest for fast, reliable testing

## Installation

### Via npm/pnpm/yarn

```bash
# Using npx (no installation required)
npx @fedimod/fires-conformance --url https://your-fires-server.example

# Using pnpm
pnpm dlx @fedimod/fires-conformance --url https://your-fires-server.example

# Using yarn
yarn dlx @fedimod/fires-conformance --url https://your-fires-server.example

```

### Via Docker

```bash
# Run conformance tests against a server
docker run --rm ghcr.io/fedimod/fires-conformance \
  --url https://your-fires-server.example

# Run tests with specific output format
docker run --rm ghcr.io/fedimod/fires-conformance \
  --url https://your-fires-server.example \
  --reporter junit \
  --output-file results.xml
```

## Usage

### Basic Usage

Test a FIRES server implementation:

```bash
fires-conformance --url https://fires.example.org
```

### Command Line Options

#### Required Options

- `--url <url>` - URL of the FIRES server to test

#### Output Options

- `--reporter <type>` - Output format for test results
  - `console` (default) - Human-readable console output
  - `junit` - JUnit XML format for CI/CD systems
  - `html` - HTML report file
  - `json` - JSON format for programmatic consumption

- `--output-file <path>` - Path to write output file (for non-console reporters)

#### Test Selection

- `--category <categories>` - Run only specific test categories (comma-separated)
  - Example: `--category labels,nodeinfo`
  - Available categories:
    - `labels` - Label endpoint tests
    - `datasets` - Dataset endpoint tests (when implemented)
    - `nodeinfo` - NodeInfo endpoint tests
    - `json-ld` - JSON-LD format validation across all endpoints
    - `http` - HTTP protocol compliance
    - `security` - Security-related tests

- `--exclude-category <categories>` - Exclude specific test categories (comma-separated)

#### Other Options

- `--help` - Display help information
- `--version` - Display version information
- `--verbose` - Enable verbose output
- `--no-color` - Disable colored output

### Examples

#### CI/CD Integration

```bash
# Generate JUnit report for CI systems
fires-conformance \
  --url https://staging.fires.example.org \
  --reporter junit \
  --output-file test-results.xml
```

#### Selective Testing

```bash
# Test only Labels endpoints
fires-conformance --url https://fires.example.org --category labels

# Test everything except security tests
fires-conformance --url https://fires.example.org --exclude-category security

# Test JSON-LD and HTTP compliance
fires-conformance --url https://fires.example.org --category json-ld,http
```

#### Docker Examples

```bash
# Test local development server
docker run --rm --network host \
  ghcr.io/fedimod/fires-conformance \
  --url http://localhost:3333

# Generate JUnit report for CI
docker run --rm -v $(pwd):/output \
  ghcr.io/fedimod/fires-conformance \
  --url https://fires.example.org \
  --reporter junit \
  --output-file /output/results.xml

# Test with verbose output
docker run --rm \
  ghcr.io/fedimod/fires-conformance \
  --url https://fires.example.org \
  --verbose
```

## What Gets Tested

The conformance suite validates:

### Labels Endpoint
- Collection endpoint (`/labels`) returns valid JSON-LD
- Individual label endpoints (`/labels/:id`) return valid JSON-LD
- Content negotiation (HTML vs JSON-LD based on Accept header)
- Pagination behavior
- Label structure and required fields
- Linked data context validity

### NodeInfo Endpoint
- Well-known discovery endpoint (`/.well-known/nodeinfo`)
- NodeInfo 2.1 endpoint structure
- Required metadata fields
- Protocol identification

### Datasets Endpoint
- Dataset collection endpoints
- Individual dataset retrieval
- Resumable data transfer
- Change tracking

### HTTP Compliance
- Appropriate status codes
- Content-Type headers
- CORS headers (if applicable)
- Rate limiting behavior

### Security
- HTTPS availability (for production servers)
- No sensitive data leakage
- Proper authentication rejection

## CI/CD Integration

### GitHub Actions

```yaml
name: FIRES Conformance
on: [push, pull_request]

jobs:
  conformance:
    runs-on: ubuntu-latest
    steps:
      - name: Start FIRES server
        run: |
          # Your server startup logic here
          docker compose up -d

      - name: Wait for server
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:3333/nodeinfo/2.1; do sleep 2; done'

      - name: Run conformance tests
        run: |
          npx @fedimod/fires-conformance \
            --url http://localhost:3333 \
            --reporter junit \
            --output-file results.xml

      - name: Publish test results
        uses: EnricoMi/publish-unit-test-result-action@v2
        if: always()
        with:
          files: results.xml
```

## Development

### Running Tests Locally

```bash
# Install dependencies
pnpm install

# Run tests against a local server
pnpm test -- --url http://localhost:3333

# Run tests with coverage
pnpm test:coverage

# Run in watch mode during development
pnpm test:watch
```

### Project Structure

Tests are organized by category in separate directories for selective execution:

```
components/conformance/
├── src/
│   ├── tests/
│   │   ├── labels/      # Label endpoint tests (--category labels)
│   │   ├── datasets/    # Dataset endpoint tests (--category datasets)
│   │   ├── nodeinfo/    # NodeInfo tests (--category nodeinfo)
│   │   ├── json-ld/     # JSON-LD validation (--category json-ld)
│   │   ├── http/        # HTTP compliance (--category http)
│   │   └── security/    # Security tests (--category security)
│   └── cli.ts           # CLI interface
├── package.json
├── vitest.config.ts
├── Dockerfile
└── README.md
```

The CLI maps `--category` options to specific test directories, allowing Vitest to run only the relevant test files.

## API Design Stability

The conformance suite exposes a deliberately limited CLI interface to maintain API stability. While the test suite is built on Vitest, we don't expose all Vitest options directly to avoid locking ourselves into Vitest-specific features as part of the public API.

If you need additional testing capabilities not covered by the current CLI options, please [open an issue](https://github.com/fedimod/fires/issues) to discuss your use case.

## Contributing

Contributions are welcome! When adding new tests:

1. Place tests in the appropriate category directory for selective execution
2. Follow existing test structure and naming conventions
3. Document any new command-line options
4. Update this README with examples
5. Ensure tests work in both npm and Docker environments

## License

This project is licensed under the AGPL-3.0 License.

## Acknowledgements

[<img src="/docs/public/nlnet-logo.svg" alt="NLNet" height="80px" />](http://nlnet.nl)&nbsp;&nbsp;&nbsp;&nbsp;
[<img src="/docs/public/NGI0Entrust_tag.svg" alt="NGI Zero" height="80px"/>](http://nlnet.nl/NGI0)

This project was funded through the <a href="https://NLnet.nl/entrust">NGI0 Entrust</a> Fund, a fund established by <a href="https://nlnet.nl">NLnet</a> with financial support from the European Commission's <a href="https://ngi.eu">Next Generation Internet</a> programme, under the aegis of <a href="https://commission.europa.eu/about-european-commission/departments-and-executive-agencies/communications-networks-content-and-technology_en">DG Communications Networks, Content and Technology</a> under grant agreement N<sup>o</sup> 101069594.
<br><br><br>
[<img src="/docs/public/nivenly-foundation-logo-with-text.png" alt="Nivenly Foundation" height="80px"/>](http://nivenly.org)

The writing of the proposal outlining FIRES was funded by <a href="https://nivenly.org">Nivenly Foundation</a>.
