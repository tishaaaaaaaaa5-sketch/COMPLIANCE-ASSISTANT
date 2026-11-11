# Compliance Assistant — Project Overview

## Summary

Compliance Assistant is a prototype for AI-assisted source-code triage. The supplied Node.js application integrates Google Gemini for compliance-oriented Q&A and legacy-code analysis, can fetch a bounded set of candidate source files from a public GitHub repository, generates PDF reports, and exposes selected functions through an MCP server.

The intended user is a developer or reviewer who wants help identifying potential security and privacy control gaps before conducting a more rigorous human assessment.

## Problem addressed

Small teams may lack dedicated compliance engineering resources. Security-relevant code patterns can be difficult to locate across payment, authentication, logging, and legacy modules. The project explores whether an LLM-based assistant can make an initial review more accessible and produce a structured set of candidate issues and remediation ideas.

This does not mean that a scan replaces a formal audit, nor that it can determine organization-wide compliance.

## Implemented workflow in the supplied archive

1. Ask a compliance-related question about the bundled sample code.
2. Select candidate source files from a public GitHub repository using path priorities and size/count caps.
3. Submit selected source text and a question to Gemini.
4. Return a generated analysis and the names of files selected for review.
5. Generate a PDF from the returned text.
6. Expose selected operations through MCP.

The GitHub scanner is bounded: the supplied implementation caps the scan at 25 files, 50 KB per file, and approximately 80 KB total prompt content. It skips a number of generated, dependency, documentation, sample, and test paths. Therefore it is not a complete repository scanner.

## Technology

- Node.js / ECMAScript modules
- Express
- Google Gemini SDK
- Axios / GitHub REST API
- PDFKit
- Jest / Supertest
- Model Context Protocol SDK

## Testing inventory

Static inspection of the supplied source archive found 69 test/it declarations: 25 unit, 26 integration, and 18 security. These are source counts, not passing test results. No reproducible test run is claimed in this document. See TESTING.md.

## Evaluation and limitations

No independent labeled benchmark or expert adjudication was supplied. There is no verified 99% detection accuracy, measured reduction in audit costs, guaranteed free or unlimited usage, or evidence of production readiness.

An LLM can hallucinate framework mappings, misread code context, omit relevant files, or overstate legal and business consequences. Reports must label findings as candidates and include evidence for human verification.

## Compliance boundaries

- A source-code scan cannot determine organization-wide PCI-DSS, GDPR, HIPAA, SOC 2, or ISO 27001 compliance.
- Framework applicability depends on system scope, processing purpose, data flows, contracts, jurisdiction, and the relevant standard version.
- A code observation does not by itself prove a breach, legal violation, regulatory penalty, or payment-processing suspension.
- HIPAA applicability is not inferred merely because data is sensitive; the covered-entity/business-associate context and protected health information status must be established.
- The generated PDF is a report format, not an audit attestation.

## Future work

1. Add source evidence and line references to every finding.
2. Separate detection, severity, and framework applicability decisions.
3. Require a human review status for each candidate finding.
4. Add a benchmark with expert-labeled positive and negative examples.
5. Measure precision, recall, false-positive rate, and confidence intervals.
6. Strengthen request validation, rate limiting, error redaction, and report provenance.
7. Execute the full test suite in CI and publish reproducible results.

## Disclaimer

Educational prototype and triage aid only. Not legal advice, compliance certification, or a substitute for qualified independent assessment.
