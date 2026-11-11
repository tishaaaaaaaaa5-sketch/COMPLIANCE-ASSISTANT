# Compliance Assistant

**AI-assisted source-code triage for security and compliance-related risks.**

Compliance Assistant is a Node.js prototype that uses Google Gemini to analyze a bundled sample codebase, answer compliance-related questions, scan selected files from a public GitHub repository, suggest legacy-code modernization options, and generate PDF reports. It also exposes selected operations through an MCP server.

It is a **decision-support prototype**, not a compliance certification product, legal opinion, penetration-testing service, or replacement for an independent assessment.

## Current project status

The application source is now included in this repository as [a source archive](source/Compliance-Assistant-source.zip). It contains the Node.js/Express application, Gemini integration, repository scanning logic, PDF report generator, MCP server, sample repository, Jest test files, and setup guide. It excludes populated secrets, `.env`, and `node_modules`.

## Capabilities

- Gemini-powered compliance Q&A over bundled sample source files.
- Public GitHub repository scanning with file-selection and size limits.
- Legacy file assessment and modernization suggestions.
- PDF report generation.
- MCP tools for asking questions, listing and reading bundled files, modernization, and GitHub scanning.

These features describe a decision-support prototype, not independently validated enterprise controls.

## Technology

- Node.js with ECMAScript modules and Express
- Google Gemini SDK (`@google/genai`)
- GitHub REST API via Axios
- Jest and Supertest
- PDFKit
- Model Context Protocol SDK

## Repository structure

| Path | Purpose |
|---|---|
| source/ | Downloadable application source archive and contents guide |
| docs/ | Scope, claims policy, methodology, and testing notes |
| results/ | Audit artifact documentation and sample outputs |
| SECURITY.md | Credential hygiene and vulnerability reporting |

To run the application, extract the source archive, open `project/`, install dependencies with `npm ci`, configure a Gemini API key in a local `.env` file based on `.env.example`, and follow `SETUP.md`. Never commit the populated `.env`.

## Sample audit result

The supplied sample PDF is titled *Compliance Audit Report*, identifies Bundled Sample Systems, is dated May 9, 2026, and lists PCI-DSS, GDPR, and HIPAA. It reports five candidate observations involving CVV logging, HTTP transmission, PAN logging, password/credential storage, and payroll SSN/salary output.

The PDF identifies IBM watsonx.ai / granite-34b-code-instruct as its analysis engine. Preserve that attribution for this specific artifact; do not relabel it as a Gemini report.

The audit content and interpretation are documented in [the sample audit notes](results/sample-audits/README.md). See [audit interpretation](docs/AUDIT_INTERPRETATION.md) before relying on any conclusion in the sample.

## Testing

The three Jest suites contain 69 test declarations: 25 unit, 26 integration, and 18 security. The project maintainer reports that all 69 tests pass. This repository update has not independently reproduced that pass result; the attempted local rerun was blocked by a Jest setup-file resolution error in the execution environment. See [testing notes](docs/TESTING.md) for the distinction and recommended evidence.

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
