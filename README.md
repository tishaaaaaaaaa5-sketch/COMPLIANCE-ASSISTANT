# Compliance Assistant

**AI-assisted source-code triage for security and compliance-related risks.**

Compliance Assistant is a Node.js prototype that uses Google Gemini to analyze bundled sample source files, answer compliance-oriented questions, scan a bounded set of files from public GitHub repositories, suggest legacy-code modernization options, generate PDF reports, and expose selected operations through an MCP server.

> **Scope:** This is a decision-support prototype—not a compliance certification service, legal opinion, penetration test, or replacement for an independent audit. AI-generated findings and framework mappings require human verification.

## What it does

- Compliance-oriented Q&A over the bundled sample repository.
- Bounded source review of public GitHub repositories (up to 25 files, 50 KB per file, and approximately 80 KB of prompt content).
- Legacy-code explanation and modernization suggestions.
- PDF report generation.
- MCP tools for compliance Q&A, sample-file access, modernization, and GitHub scanning.

## Interface preview

The image below is a static render of the bundled HTML interface (controls are not interactive in the image).

![Compliance Assistant static UI preview](docs/assets/compliance-assistant-ui-preview.png)

## Source tree

The application source is now browsable in [`project/`](project/):

```text
project/
├── server.js
├── mcp-server.js
├── package.json
├── package-lock.json
├── .env.example
├── SETUP.md
├── lib/
│   ├── compliance.js
│   └── report.js
├── public/
│   └── index.html
├── sample-repo/
│   ├── auth.js
│   ├── batch-job.js
│   ├── checkout.js
│   ├── legacy-payroll.cobol.txt
│   ├── logger.js
│   ├── payments.js
│   └── users.js
└── tests/
    ├── unit/
    ├── integration/
    └── security/
```

## Run locally

Requirements: Node.js 20 or later (Node 22 is used in CI).

```bash
cd project
npm ci
cp .env.example .env
# Set GEMINI_API_KEY in .env; optionally set GITHUB_TOKEN.
npm start
```

The local UI is served by the application. Never commit `.env` or API keys.

## Tests and CI

Run:

```bash
cd project
npm ci
npm test -- --runInBand
npm run test:unit -- --runInBand
npm run test:integration -- --runInBand
npm run test:security -- --runInBand
```

A GitHub Actions workflow runs the full Jest suite on pushes and pull requests. The latest verified run reports **3 suites passed and 69 tests passed (0 failed)** on Node.js 22.23.4. See the [CI run](https://github.com/tishaaaaaaaaa5-sketch/COMPLIANCE-ASSISTANT/actions/runs/43122334444) and [testing record](docs/TESTING.md). Re-run CI after every code change; this status applies to the recorded commit only.

## Sample audit

The historical sample audit PDF is retained under `results/sample-audits/`. It was produced with a different model provider from the current source and should be interpreted only as a historical artifact. See its accompanying README for scope and provenance.

## Limitations

- Static source review cannot establish organization-wide PCI-DSS, GDPR, HIPAA, SOC 2, or ISO 27001 compliance.
- The scanner only inspects a bounded subset of public repository files.
- Framework applicability depends on system scope, data flows, jurisdiction, contracts, and standard version.
- Findings can be incomplete or incorrect; verify evidence and mappings with qualified reviewers.
- No numeric detection accuracy, guaranteed savings, or production-readiness claim is made.