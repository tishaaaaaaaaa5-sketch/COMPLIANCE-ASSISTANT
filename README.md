# Compliance Assistant

<p align="center">
  <strong>AI-assisted source-code analysis for security and compliance risk triage</strong><br/>
  Analyze repositories, explore potential issues, generate remediation guidance, and produce shareable PDF reports.
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js&logoColor=white" />
  <img alt="Express" src="https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white" />
  <img alt="Google Gemini" src="https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=googlegemini&logoColor=white" />
  <img alt="MCP" src="https://img.shields.io/badge/Integration-MCP-6B5B95" />
  <img alt="Tests" src="https://img.shields.io/badge/Tests-69%20passing-success" />
</p>

---

## Overview

**Compliance Assistant** is a Node.js application that helps developers investigate potential security and compliance-related risks in source code. It combines AI-assisted analysis with repository scanning, modernization suggestions, and PDF report generation.

The application can work with a bundled sample codebase or scan selected files from a public GitHub repository. It also exposes selected capabilities through a Model Context Protocol (MCP) server.

> **Project scope:** This is an educational decision-support prototype for preliminary code review. It is not a compliance certification tool, legal opinion, penetration test, or substitute for an independent security assessment.

## Highlights

| Capability | What it does |
|---|---|
| AI-assisted analysis | Uses Google Gemini to answer questions about source code and explain potential risks |
| GitHub repository scanning | Retrieves and analyzes a bounded selection of files from a public repository |
| Risk triage | Surfaces candidate security and compliance-related observations for human review |
| Modernization guidance | Suggests approaches for updating selected legacy code |
| PDF reporting | Generates downloadable reports summarizing analysis |
| MCP integration | Makes selected application functions available as MCP tools |

## How it works

1. **Choose a codebase** — use the bundled sample project or provide a public GitHub repository.
2. **Select an analysis task** — ask a question, scan repository files, or request modernization guidance.
3. **Review the output** — inspect the AI-generated explanation and candidate findings.
4. **Generate a report** — create a PDF summary for further review.
5. **Validate independently** — confirm each finding with code inspection, tests, and qualified security or compliance expertise.

## Technology stack

- **Runtime:** Node.js (ECMAScript modules)
- **Backend:** Express
- **AI:** Google Gemini via `@google/genai`
- **Repository access:** GitHub REST API and Axios
- **Testing:** Jest and Supertest
- **Reports:** PDFKit
- **Tool integration:** Model Context Protocol (MCP)

## Project structure

```text
COMPLIANCE-ASSISTANT/
├── source/
│   ├── Compliance-Assistant-source.zip
│   └── README.md
├── docs/
│   ├── AUDIT_INTERPRETATION.md
│   ├── METHODOLOGY.md
│   ├── PROJECT_OVERVIEW.md
│   └── TESTING.md
├── results/
│   └── sample-audits/
├── SECURITY.md
└── README.md
```

The application source is provided in the [source archive](source/Compliance-Assistant-source.zip). It includes the Express application, frontend, Gemini integration, repository scanning logic, PDF report generator, MCP server, sample project, test suites, and setup instructions.

## Getting started

### Prerequisites

- Node.js and npm
- A Google Gemini API key
- Internet access for Gemini requests and public GitHub repository scanning

### Setup

1. Download and extract the [application source archive](source/Compliance-Assistant-source.zip).
2. Open the extracted `project/` directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

5. Follow the instructions in `SETUP.md` and start the application using the documented npm script.

**Security note:** Keep your populated `.env` file private. Never commit API keys, credentials, or private repository data.

## Testing

The project includes **69 automated tests** across three suites:

| Suite | Tests |
|---|---:|
| Unit | 25 |
| Integration | 26 |
| Security | 18 |
| **Total** | **69** |

**Test status: 69/69 passing**, as reported by the project maintainer. Run the test command documented in the source project's `package.json` to reproduce the result in your own environment.

## Sample audit artifact

The repository includes documentation for a sample audit report covering candidate observations related to payment-card data handling, transport security, credential storage, and sensitive payroll information.

The sample report is an illustrative analysis artifact. Its observations should be treated as leads for human investigation—not as independently confirmed vulnerabilities or proof of regulatory non-compliance. The model attribution printed in the original report is preserved in the accompanying project documentation.

See [sample audit notes](results/sample-audits/README.md) and [audit interpretation](docs/AUDIT_INTERPRETATION.md).

## Responsible use and limitations

- AI-generated analysis may be incorrect, incomplete, or context-dependent.
- Repository scanning is bounded by file-selection and size limits; it does not inspect every file or runtime behavior.
- A potential code issue does not automatically establish a legal or regulatory violation.
- Framework mappings and suggested remediations require review against the applicable standards, versions, and deployment context.
- Generated PDF reports are summaries for review, not audit opinions or compliance attestations.
- No accuracy percentage, guaranteed cost saving, or production-readiness claim is made.

## Security

Please do not submit secrets, production credentials, payment data, personal data, or confidential source code unless you are authorized to do so.

For credential exposure or security concerns, follow the guidance in [SECURITY.md](SECURITY.md). Rotate any credential that may have been exposed; removing it from a later version does not invalidate it.

## Documentation

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Methodology](docs/METHODOLOGY.md)
- [Testing](docs/TESTING.md)
- [Audit interpretation](docs/AUDIT_INTERPRETATION.md)
- [Security policy](SECURITY.md)

## Disclaimer

Compliance Assistant is provided for educational, development, and preliminary triage purposes. It does not provide legal advice, certify compliance, or replace qualified security, privacy, legal, or audit professionals.

## License

No license is currently specified. All rights are reserved by default unless a license is added to this repository.
