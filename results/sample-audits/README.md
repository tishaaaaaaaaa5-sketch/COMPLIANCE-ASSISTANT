# Sample audit artifacts

## Bundled Sample Systems

**Artifact:** 2026-05-08-bundled-sample-systems.pdf  
**Report date printed in PDF:** May 9, 2026  
**Subject:** Bundled Sample Systems  
**Framework labels printed:** PCI-DSS, GDPR, HIPAA  
**Analysis engine printed:** IBM watsonx.ai / granite-34b-code-instruct

### Reported output

The sample PDF contains five candidate observations:
1. CVV allegedly captured in logs or console output.
2. Cardholder data allegedly transmitted to a payment processor over HTTP.
3. Full PAN allegedly written to request logs and console output.
4. Hardcoded administrative credentials and plaintext password storage allegedly present.
5. SSN and salary data allegedly displayed or logged by a COBOL payroll module.

The artifact also provides remediation suggestions. Refer to the PDF for the original wording and page layout.

### Interpretation

This is a sample report artifact, not an independently reproduced audit. The source files named in the report were not available in this repository during this update. Therefore, none of the five observations has been independently confirmed here.

The report's global compliance conclusion, penalty estimates, legal characterizations, and predicted regulatory or payment-processing consequences exceed what can be established from the PDF alone. See [Audit interpretation and claims policy](../../docs/AUDIT_INTERPRETATION.md).

### Provenance and integrity

The report is preserved as supplied. It identifies IBM watsonx.ai / granite-34b-code-instruct as the analysis engine. Do not change this attribution unless a new report is generated and its provenance is recorded.

For future artifacts, add a SHA-256 checksum, source commit, analyzer version, run configuration, scope, and reviewer disposition.
