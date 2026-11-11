# Compliance Assistant

**AI-assisted source-code triage for security and compliance-related risks.**

Compliance Assistant is a Node.js prototype that uses Google Gemini to analyze a bundled sample codebase, answer compliance-related questions, scan selected files from a public GitHub repository, suggest legacy-code modernization options, and generate PDF reports. It also exposes selected operations through an MCP server.

It is a **decision-support prototype**, not a compliance certification product, legal opinion, penetration-testing service, or replacement for an independent assessment.

## Current project status

The source archive supplied for review contains the Node.js application, bundled sample repository, Jest tests, report generator, and MCP server. The GitHub repository was empty when this documentation work began, so this first repository update establishes the project documentation and audit interpretation policy. The complete source archive has **not** yet been mirrored into this GitHub repository.

No test execution, security certification, model-accuracy benchmark, or production-readiness assessment is claimed by this README.

## Capabilities in the supplied source archive

- Gemini-powered compliance Q&A over bundled sample source files.
- Public GitHub repository scanning with file-selection and size limits.
- Legacy file assessment / modernization suggestions.
- PDF report generation.
- MCP tools for asking questions, listing and reading bundled files, modernization, and GitHub scanning.

These features describe the supplied source archive. They should not be read as independently validated enterprise controls.

## Technology

- Node.js with ECMAScript modules
- Express
- Google Gemini SDK (@google/genai)
- GitHub REST API via Axios
- Jest and Supertest
- PDFKit
- Model Context Protocol SDK

## Repository structure

| Path | Purpose |
|---|---|
| docs/ | Scope, claims policy, methodology, and testing notes |
| results/ | Audit artifact documentation and sample outputs |
| SECURITY.md | Credential hygiene and vulnerability reporting |

The application source archive is being reviewed separately before it is added here. Generated dependencies, local tool caches, .env files, and unrelated build artifacts should not be committed.

## Sample audit result

The supplied sample PDF is titled *Compliance Audit Report*, identifies Bundled Sample Systems, is dated May 9, 2026, and lists PCI-DSS, GDPR, and HIPAA. It reports five candidate observations involving CVV logging, HTTP transmission, PAN logging, password/credential storage, and payroll SSN/salary output.

The PDF identifies IBM watsonx.ai / granite-34b-code-instruct as its analysis engine. Preserve that attribution for this specific artifact; do not relabel it as a Gemini report.

The PDF itself has not yet been uploaded to this repository. The audit content and interpretation are documented in [the sample audit notes](results/sample-audits/README.md). See [audit interpretation](docs/AUDIT_INTERPRETATION.md) before relying on any conclusion in the sample.

## Testing evidence

The supplied archive contains 69 test/it declarations across three Jest files:
- Unit: 25 declarations
- Integration: 26 declarations
- Security: 18 declarations

These are source-level test declarations, **not proof that 69 tests pass**. The test suite has not been executed in a clean, reproducible environment for this repository update. See [testing notes](docs/TESTING.md).

## Important limitations

- Model-generated findings can be incomplete, inaccurate, or inapplicable.
- Source scanning is bounded and does not inspect every file or runtime behavior.
- Framework mapping needs reviewer verification against the applicable version and organizational scope.
- A PDF report is not an audit opinion or compliance attestation.
- No measured accuracy, guaranteed savings, or production readiness is claimed.

## Security

Never commit API keys, populated environment files, credentials, customer information, payment data, or unredacted audit evidence. If a credential was ever exposed, revoke it and issue a replacement; deleting a file in a later commit does not remove exposure from Git history.

See [SECURITY.md](SECURITY.md).

## Disclaimer

For educational and triage use only. Compliance Assistant does not provide legal advice, certify compliance, or replace a qualified assessor, auditor, privacy professional, or counsel.

## License

No license is currently declared in this repository. Do not assume reuse or redistribution rights until a license is added.
