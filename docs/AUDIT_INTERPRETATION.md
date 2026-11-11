# Audit interpretation and claims policy

## Why this document exists

AI-generated compliance language can sound more conclusive than the evidence permits. This policy defines how to read the bundled sample report and how future reports should communicate uncertainty.

## What the sample report actually says

The eight-page PDF titled *Compliance Audit Report* is dated May 9, 2026. It names Bundled Sample Systems, lists PCI-DSS, GDPR, and HIPAA, asks whether payment processing is PCI-DSS compliant, and lists seven reviewed files. It attributes the analysis to IBM watsonx.ai / granite-34b-code-instruct.

It reports five findings:
1. CVV appearing in logs or console output (checkout.js, logger.js).
2. Cardholder data allegedly sent over HTTP (payments.js).
3. Full PAN allegedly written to logs (logger.js, checkout.js).
4. Hardcoded administrative credentials and plaintext passwords (auth.js, users.js).
5. SSN and salary output in a COBOL payroll module (legacy-payroll.cobol.txt).

This repository update preserves those as claims made by the sample PDF. It does not independently inspect the referenced source files, reproduce the analyzer run, or verify the findings.

## Claims in the PDF that should not be repeated as established facts

The opening statement says the entire system is non-compliant with PCI-DSS, GDPR, and HIPAA and predicts immediate revocation of processing privileges and significant penalties. The report's five observations do not, by themselves, establish those organization-wide conclusions or outcomes.

The PDF also includes specific financial estimates, fine statements, legal characterizations, and remediation deadlines. These should be treated as unverified narrative generated in the sample report—not as legal advice, authoritative penalty calculations, or guaranteed timelines.

The question in the report is about payment processing, while one finding concerns payroll SSN/salary output and the report lists HIPAA. Framework applicability and scope need separate substantiation. A Social Security number is personal information, but it is not automatically HIPAA-protected health information merely because it is sensitive.

## Safer reporting language

Use language such as:

> The automated review identified a potential issue that may be relevant to [control / requirement]. The observation is based on [specific code evidence]. A reviewer should verify the behavior, data flow, applicable scope, and compensating controls before assigning a compliance status.

Avoid:
- “The organization is compliant / non-compliant” based only on source snippets.
- “This will trigger a fine / suspension / revocation.”
- “This proves a breach occurred.”
- Numeric accuracy, detection-rate, or savings claims without an evaluation dataset and protocol.

## Minimum evidence expected for each finding

- File path and line range or stable code symbol.
- Exact relevant code excerpt or a safe redacted representation.
- Data classification and data-flow context.
- Threat/control rationale.
- Framework version, requirement identifier, and explanation of applicability.
- Severity rationale distinct from compliance status.
- Confidence and known uncertainty.
- Human reviewer decision: confirmed, rejected, needs more evidence, or not applicable.
- Remediation and a test that demonstrates the behavior is corrected.

## Human review boundary

A generated report is a triage aid. Formal compliance assessments require a scoped review of the organization, systems, processes, contracts, evidence, and applicable requirements by appropriately qualified personnel.
